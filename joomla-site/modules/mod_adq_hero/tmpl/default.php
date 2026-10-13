<?php
/**
 * @package     Adequate Safaris
 * @subpackage  mod_adq_hero
 * Default layout.
 *
 * @var  string  $uid
 * @var  string  $height
 * @var  bool    $autoplay
 * @var  int     $interval
 * @var  string  $motion
 * @var  bool    $showCaptions
 * @var  bool    $showControls
 * @var  bool    $showProgress
 * @var  string  $overlay
 * @var  array   $slides
 */

defined('_JEXEC') or die;

use Joomla\CMS\Language\Text;
use Joomla\CMS\Uri\Uri;

$root = Uri::root();
?>
<section id="<?php echo $uid; ?>"
         class="adq-hero adq-hero--<?php echo htmlspecialchars($height, ENT_QUOTES, 'UTF-8'); ?> adq-hero--overlay-<?php echo htmlspecialchars($overlay, ENT_QUOTES, 'UTF-8'); ?>"
         data-adq-hero
         data-motion="<?php echo htmlspecialchars($motion, ENT_QUOTES, 'UTF-8'); ?>"
         data-autoplay="<?php echo $autoplay ? '1' : '0'; ?>"
         data-interval="<?php echo (int) $interval; ?>"
         role="region"
         aria-roledescription="carousel"
         aria-label="<?php echo Text::_('MOD_ADQ_HERO_REGION_LABEL'); ?>">

    <div class="adq-hero__track">
        <?php foreach ($slides as $i => $slide) :
            $img    = $slide['image'];
            if ($img === '') { continue; }
            $imgUrl = preg_match('#^https?://#', $img) ? $img : $root . ltrim($img, '/');
            // derive a webp sibling when the jpg sits in our hero folder
            $webp   = preg_replace('/\.(jpe?g|png)$/i', '-1300.webp', $imgUrl);
            $isActive = $i === 0;
            ?>
            <div class="adq-hero__slide<?php echo $isActive ? ' is-active' : ''; ?>"
                 data-index="<?php echo $i; ?>"
                 role="group"
                 aria-roledescription="slide"
                 aria-label="<?php echo ($i + 1) . ' / ' . count($slides); ?>"
                 aria-hidden="<?php echo $isActive ? 'false' : 'true'; ?>">

                <picture class="adq-hero__media">
                    <source type="image/webp" srcset="<?php echo htmlspecialchars($webp, ENT_QUOTES, 'UTF-8'); ?>">
                    <img src="<?php echo htmlspecialchars($imgUrl, ENT_QUOTES, 'UTF-8'); ?>"
                         alt="<?php echo htmlspecialchars($slide['heading'], ENT_QUOTES, 'UTF-8'); ?>"
                         <?php echo $isActive ? 'fetchpriority="high"' : 'loading="lazy"'; ?>
                         decoding="async" />
                </picture>

                <?php if ($showCaptions && ($slide['heading'] || $slide['subtext'])) : ?>
                <div class="container adq-hero__caption adq-hero__caption--<?php echo htmlspecialchars($slide['align'], ENT_QUOTES, 'UTF-8'); ?>">
                    <?php if ($slide['eyebrow']) : ?>
                        <p class="adq-hero__eyebrow"><?php echo htmlspecialchars($slide['eyebrow'], ENT_QUOTES, 'UTF-8'); ?></p>
                    <?php endif; ?>
                    <?php if ($slide['heading']) : ?>
                        <h2 class="adq-hero__heading"><?php echo htmlspecialchars($slide['heading'], ENT_QUOTES, 'UTF-8'); ?></h2>
                    <?php endif; ?>
                    <?php if ($slide['subtext']) : ?>
                        <p class="adq-hero__subtext"><?php echo htmlspecialchars($slide['subtext'], ENT_QUOTES, 'UTF-8'); ?></p>
                    <?php endif; ?>
                    <?php if ($slide['button_text'] || $slide['button2_text']) : ?>
                    <div class="adq-hero__actions">
                        <?php if ($slide['button_text']) : ?>
                            <a class="adq-btn adq-btn--primary adq-btn--lg"
                               href="<?php echo htmlspecialchars($slide['button_url'] ?: '#', ENT_QUOTES, 'UTF-8'); ?>">
                                <?php echo htmlspecialchars($slide['button_text'], ENT_QUOTES, 'UTF-8'); ?>
                            </a>
                        <?php endif; ?>
                        <?php if ($slide['button2_text']) : ?>
                            <a class="adq-btn adq-btn--ghost adq-btn--lg adq-hero__btn-ghost"
                               href="<?php echo htmlspecialchars($slide['button2_url'] ?: '#', ENT_QUOTES, 'UTF-8'); ?>">
                                <?php echo htmlspecialchars($slide['button2_text'], ENT_QUOTES, 'UTF-8'); ?>
                            </a>
                        <?php endif; ?>
                    </div>
                    <?php endif; ?>
                </div>
                <?php endif; ?>
            </div>
        <?php endforeach; ?>
    </div>

    <?php if ($showControls && count($slides) > 1) : ?>
    <button type="button" class="adq-hero__arrow adq-hero__arrow--prev" data-adq-hero-prev
            aria-label="<?php echo Text::_('MOD_ADQ_HERO_PREV'); ?>">
        <span aria-hidden="true">&#8249;</span>
    </button>
    <button type="button" class="adq-hero__arrow adq-hero__arrow--next" data-adq-hero-next
            aria-label="<?php echo Text::_('MOD_ADQ_HERO_NEXT'); ?>">
        <span aria-hidden="true">&#8250;</span>
    </button>

    <div class="adq-hero__dots" role="tablist" aria-label="<?php echo Text::_('MOD_ADQ_HERO_SLIDES'); ?>">
        <?php foreach ($slides as $i => $slide) : ?>
            <button type="button" role="tab"
                    class="adq-hero__dot<?php echo $i === 0 ? ' is-active' : ''; ?>"
                    data-adq-hero-goto="<?php echo $i; ?>"
                    aria-label="<?php echo Text::sprintf('MOD_ADQ_HERO_GOTO', $i + 1); ?>"
                    aria-selected="<?php echo $i === 0 ? 'true' : 'false'; ?>"></button>
        <?php endforeach; ?>
    </div>
    <?php endif; ?>

    <?php if ($showProgress && count($slides) > 1) : ?>
    <div class="adq-hero__progress" aria-hidden="true"><span class="adq-hero__progress-bar"></span></div>
    <?php endif; ?>
</section>