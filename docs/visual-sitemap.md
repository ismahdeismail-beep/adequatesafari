# Visual Sitemap — Adequate Safaris (Current)

```mermaid
flowchart TD
    Home[🏠 Home<br/>SP PageBuilder Landing]
    
    Home --> About[📖 About Us]
    Home --> Accommodation[🏨 Accommodation]
    Home --> Cabs[🚗 Our Cabs<br/>external: absolutecabs.co.ke]
    Home --> Book[📝 Book a Safari<br/>BreezingForms]
    Home --> Contact[📞 Contact Us]

    %% Kenya Lodge Safaris
    Home --> KLS[🦁 Kenya Lodge Safaris]
    KLS --> KL2[2 Days<br/>4 tours]
    KLS --> KL3[3 Days<br/>8 tours]
    KLS --> KL4[4 Days<br/>3 tours]
    KLS --> KL5[5 Days<br/>2 tours]
    KLS --> KL6[6 Days<br/>1 tour]
    KLS --> KL7[7 Days<br/>2 tours]
    KLS --> KL8[8 Days<br/>1 tour]
    KLS --> KL9[9 Days<br/>1 tour]
    KLS --> KL14[14 Days<br/>1 tour]

    %% Kenya Camping
    Home --> KCS[🏕️ Kenya Camping Safaris<br/>7 tours]

    %% Kenya Flying
    Home --> KFS[✈️ Kenya Flying Safaris]
    KFS --> KFSLamu[Fly to Lamu Island<br/>5 hotels]
    KFS --> KFSMara[Fly to Masai Mara<br/>9 camps/lodges]
    KFS --> KFSWings[Wings over Kenya<br/>1 tour]
    KFS --> KFSSamburu[Fly to Samburu<br/>3 camps]
    KFS --> KFSAmboseli[Fly to Amboseli<br/>3 lodges]
    KFS --> KFSTsavo[Fly to Tsavo West<br/>1 camp]

    %% Mt Kenya
    Home --> MKC[⛰️ Mt Kenya Climb<br/>6 routes]

    %% Short Excursions
    Home --> SE[🚶 Short Excursions]
    SE --> SEN[📍 Nairobi<br/>4 excursions]
    SE --> SEM[📍 Mombasa<br/>9 excursions]

    %% Tanzania
    Home --> TZ[🇹🇿 Tanzania Safaris]
    TZ --> TZL[Lodge Safaris<br/>8 tours]
    TZ --> TZC[Camping Safaris<br/>1 tour]
    TZ --> TZK[Kilimanjaro Climb<br/>6 routes]

    %% Uganda
    Home --> UG[🇺🇬 Uganda Safaris]
    UG --> UG2[2 Days<br/>1 tour]
    UG --> UG3[3 Days<br/>3 tours]
    UG --> UG4[4 Days<br/>1 tour]
    UG --> UG5[5 Days<br/>2 tours]
    UG --> UG7[7 Days<br/>1 tour]

    %% Styling
    classDef home fill:#1e3a5f,color:#fff,stroke:#3498db,stroke-width:3px;
    classDef country fill:#27ae60,color:#fff,stroke:#2ecc71,stroke-width:2px;
    classDef subcat fill:#2c3e50,color:#fff,stroke:#34495e,stroke-width:1px;
    classDef external fill:#e67e22,color:#fff,stroke:#d35400,stroke-width:2px,stroke-dasharray: 5 5;
    classDef form fill:#8e44ad,color:#fff,stroke:#9b59b6,stroke-width:2px;

    class Home home;
    class KLS,KCS,KFS,MKC,SE,TZ,UG country;
    class KL2,KL3,KL4,KL5,KL6,KL7,KL8,KL9,KL14,KCS,KFSLamu,KFSMara,KFSWings,KFSSamburu,KFSAmboseli,KFSTsavo,MKC,SEN,SEM,TZL,TZC,TZK,UG2,UG3,UG4,UG5,UG7 subcat;
    class Cabs external;
    class Book,Contact form;
```

---

## Page Layout Wireframe (Homepage)

```mermaid
flowchart TB
    subgraph Header["🔝 Header"]
        Logo[Logo<br/>adequate safaris]
        Nav[Mega Menu Navigation<br/>7 top-level items + dropdowns]
        Mobile[☰ Mobile Toggle]
    end

    subgraph Hero["🎞️ Hero Slider<br/>Unite Revolution Slider 2"]
        Slide1[Slide 1: Brand + Book Now]
        Slide2[Slide 2: Brand + Book Now]
        Slide3[Slide 3: Brand + Book Now]
        Slide4[Slide 4: Wildebeest Migration]
        Slide5[Slide 5: Brand + Book Now]
    end

    subgraph Main["📄 Main Content"]
        Inspiration[### Top Travel Inspirations<br/>11 category cards grid]
        Accommodation[### Featured Accommodation<br/>3 property cards]
        Testimonials[### Testimonials<br/>4-review carousel]
        Latest[### Latest Safaris<br/>3 recent posts]
    end

    subgraph Sidebar["📋 Sidebar (Right Column)"]
        BookingForm[### Book a Vacation<br/>BreezingForms<br/>Name, Phone, Email, Date, Instructions, Captcha]
        ContactInfo[### Get In Touch<br/>3 phone numbers<br/>Safaricom, Airtel, Landline]
    end

    subgraph Footer["🔚 Footer"]
        Copyright[© 2026 Adequate Safaris]
        Credit[Designed by SmartAddons.Com]
        TopLink[↑ Top]
    end

    Header --> Hero
    Hero --> Main
    Main --> Sidebar
    Sidebar --> Footer
```

---

## Mega Menu Structure (Visual)

```mermaid
mindmap
  root((Adequate Safaris))
    Kenya Lodge Safaris
      2 days
        Aberdares -Nairobi
        Shimba Hills Lodge
        Tsavo East and West
        Amboseli express
      3 days
        Lake Nakuru-Rhino Safari
        Aberdares - Nyeri - Nairobi
        Great Rift Valley Lakes
        Masai Mara – Big Game Safari
        Nairobi -Amboseli & Kilimanjaro
        Amboseli-Tsavo West
        Samburu – Gerenuk Safari
        Meru – Elsa's Safari
      4 days
        Lake Naivasha/Masai Mara
        Great Rift Valley & Masai Mara
        Aberdares/Great Rift Valley/Masai Mara
      5 days
        Aberdares/Lake Nakuru/Masai Mara
        Aberdares/Samburu/Mount Kenya
      6 days
        Aberdares/Lake Nakuru/Naivasha/Masai Mara
      7 days
        Mt Kenya/Samburu/Nakuru/Mara
        Amboseli/Naivasha/Nakuru/Mara
      8 days
        Aberdares/Samburu/Rift Valley/Mara/Big Cats
      9 days
        Classic Kenya Safari
      14 days
        Kenya Culture & Wildlife
    Kenya Camping Safaris
      Lake Turkana via Chalbi Desert
      Great Rift Valley
      Amboseli National park
      Kenya Wildlife Trail
      Samburu National Reserve
      Masai Mara
      Masai Mara National Reserve
    Kenya Flying Safaris
      Fly to Lamu Island
        Stopover Guest House
        Stone House Hotel
        Peponi Hotel
        Banana House
        Island Hotel
      Fly to Masai Mara
        Sarova Game Camp
        Base Camp Tented Camp
        Keekorok Lodge
        Mara Intrepids Club
        Main Governors Camp
        Fairmont Mara Safari Club
        Kilima Tented Camp
        Kichwa Tembo Tented Camp
        Mara Serena Lodge
      Wings over Kenya
      Fly to Samburu
        Larsen's Tented Camp
        Intrepids Tented Camp
        Sopa Lodge
      Fly to Amboseli
        Amboseli Serena Lodge
        Oltukai Lodge
        Tortilis camp
      Fly to Tsavo West
        Finch Hatton's Tented Camp
    Mt Kenya Climb
      Best of Mount Kenya – 7 days
      Sirimon Track – 5 days
      Naromoru Route – 4 Days
      Naromoru route – 3 Days
      Circumnavigate Naromoru 5 Days
      Chogoria/Naromoru Travel
    Short Excursions
      Nairobi
        Nairobi City Tour
        Nairobi National Park
        Lake Nakuru & Great Rift Valley
        Karen Blixen & Giraffe Centre
      Mombasa
        Mombasa City Tour
        Shimba Hills National Park – Half day
        North Coast Bush Tours- 1 day
        Malindi –Gedi– 1 day
        Shimoni & Kisite Mpunguti Marine parks
        Pilli-Pipa dhow - evening
        The Tamarind Dhow-evening
        Tsavo East national park - 1 day
        Shimba Hills Lodge – 2 days Safari
    Tanzania Safaris
      Tanzania Lodge Safaris
        Tarangire-Lake Manyara-Ngorongoro
        Ngorongoro Crater + Lake Manyara 3 Days
        Manyara/Ngorongoro/Serengeti/Tarangire 7 days
        Manyara/Ngorongoro/Serengeti 7 days
        Ngorongoro/Serengeti/Manyara 6 days
        Manyara & Ngorongoro Serena Special
        Road Transfer Nairobi-Arusha/Moshi
        Serena Hotels Circuit
      Tanzania Camping Safaris
        Manyara & Ngorongoro 4 days
      Kilimanjaro Climb
        Mount Meru – 5 days
        Umbwe Route – 7 Days
        Shira Plateau – 7 days
        Machame route – 8 Days
        Marangu Route – 7 days
        Rongai Route – 7 Days
    Uganda Safaris
      2 days
        Lake Mburo National Park
      3 days
        Gorilla tracking - Bwindi
        Queen Elizabeth National park
        Murchison Falls National Park
      4 days
        Murchison Falls & Kibale
      5 days
        Gorilla Tracking – Bwindi & Lake Bunyonyi
        Uganda Chimpanzee Safari
      7 days
        Best of Uganda Wildlife Tours
    Other
      About Us
      Accommodation
      Our Cabs → absolutecabs.co.ke
      Book a Safari
      Contact Us
```

---

## Mermaid Rendering Notes

- **GitHub/GitLab**: Renders automatically in `.md` files
- **VS Code**: Install "Markdown Preview Mermaid Support" extension
- **Obsidian/Notion**: Native support
- **Online**: Paste into [mermaid.live](https://mermaid.live) for PNG/SVG export