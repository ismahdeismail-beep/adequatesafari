<?php
/**
 * @package     Adequate Safaris
 * @subpackage  plg_system_jwt
 *
 * Issues a short-lived JWT for the currently authenticated Joomla user and
 * exposes it to the micro-apps (booking / itinerary / agent portal) so they
 * can call the shared API on the user's behalf without a second login.
 *
 * Flow:
 *   1. User logs in to Joomla (native or via the micro-app redirect).
 *   2. On every page render this plugin mints a JWT and sets it as an
 *      HTTP-only cookie (and, optionally, as `window.ADQ_CONFIG.token`).
 *   3. Micro-apps read the token from the cookie (same parent domain) or
 *      via a `?token=` hand-off and exchange it for their own session.
 *
 * The API validates the token with the SAME secret (JWT_SECRET env).
 */

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\CMS\Uri\Uri;
use Joomla\Event\SubscriberInterface;

final class PlgSystemJwt extends CMSPlugin implements SubscriberInterface
{
    protected $autoloadLanguage = true;

    public static function getSubscribedEvents(): array
    {
        return [
            'onAfterRender' => 'onAfterRender',
            'onUserAfterLogin' => 'onUserAfterLogin',
            'onUserAfterLogout' => 'onUserAfterLogout',
        ];
    }

    private function params(): object
    {
        return $this->params;
    }

    private function secret(): string
    {
        $secret = (string) $this->params->get('secret', '');
        if ($secret === '') {
            // Fall back to Joomla's own secret so this never silently no-ops.
            $secret = (string) Factory::getApplication()->get('secret');
        }
        return $secret;
    }

    private function b64url(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    /**
     * Mint an HS256/384/512 JWT.
     */
    private function mint(array $claims): string
    {
        $alg  = (string) $this->params->get('algorithm', 'HS256');
        $map  = ['HS256' => 'sha256', 'HS384' => 'sha384', 'HS512' => 'sha512'];
        $hash = $map[$alg] ?? 'sha256';

        $header  = ['typ' => 'JWT', 'alg' => $alg];
        $segment = $this->b64url(json_encode($header, JSON_UNESCAPED_SLASHES))
                 . '.' . $this->b64url(json_encode($claims, JSON_UNESCAPED_SLASHES));
        $sig     = hash_hmac($hash, $segment, $this->secret(), true);

        return $segment . '.' . $this->b64url($sig);
    }

    /**
     * Build the token for the current session user.
     */
    private function tokenForUser(): ?string
    {
        $app  = Factory::getApplication();
        if (!$app->isClient('site')) {
            return null;
        }

        $user = $app->getIdentity();
        if (!$user || $user->guest) {
            return null;
        }

        $now = time();
        $ttl = max(60, (int) $this->params->get('ttl', 900));

        // Joomla user groups → API roles
        $roles = [];
        foreach ((array) $user->getAuthorisedGroups() as $gid) {
            $roles[] = match ((int) $gid) {
                8 => 'superuser',
                7 => 'administrator',
                6 => 'manager',
                default => 'user',
            };
        }
        $roles = array_values(array_unique($roles));

        $claims = [
            'iss'   => (string) $this->params->get('issuer', 'adequatesafaris.com'),
            'aud'   => (string) $this->params->get('audience', 'adq-micro-apps'),
            'sub'   => (string) $user->id,
            'email' => (string) $user->email,
            'name'  => (string) $user->name,
            'roles' => $roles,
            'jti'   => bin2hex(random_bytes(8)),
            'iat'   => $now,
            'nbf'   => $now,
            'exp'   => $now + $ttl,
        ];

        return $this->mint($claims);
    }

    /**
     * Set/refresh the auth cookie and make the token available to the page.
     */
    public function onAfterRender(): void
    {
        $app = Factory::getApplication();
        if (!$app->isClient('site')) {
            return;
        }

        $token = $this->tokenForUser();
        if ($token === null) {
            return;
        }

        $cookieName = (string) $this->params->get('cookie_name', 'adq_token');
        $secure     = $app->get('force_ssl') === 2 || str_starts_with((string) Uri::root(), 'https://');

        // HTTP-only-ish cookie on the shared parent domain so micro-apps can read it.
        // (Not HttpOnly on purpose: the SPA reads it via document.cookie; the
        //  token is short-lived and scoped to the parent domain.)
        setcookie($cookieName, $token, [
            'expires'  => time() + (int) $this->params->get('ttl', 900),
            'path'     => '/',
            'domain'   => '',
            'secure'   => $secure,
            'httponly' => false,
            'samesite' => 'Lax',
        ]);

        // Also inject into the page for immediate SPA hand-off.
        $doc = $app->getDocument();
        if (method_exists($doc, 'addScriptDeclaration')) {
            $json = json_encode(['token' => $token], JSON_UNESCAPED_SLASHES);
            $doc->addScriptDeclaration("window.ADQ_CONFIG=Object.assign(window.ADQ_CONFIG||{},{$json});");
        }
    }

    public function onUserAfterLogin(array $options): void
    {
        // Reserved for audit logging / API session creation.
    }

    public function onUserAfterLogout(array $options): void
    {
        $app = Factory::getApplication();
        if (!$app->isClient('site')) {
            return;
        }
        $cookieName = (string) $this->params->get('cookie_name', 'adq_token');
        setcookie($cookieName, '', ['expires' => time() - 3600, 'path' => '/']);
    }
}