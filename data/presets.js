// Built-in Niche Presets so changing the store niche requires ZERO code changes.
// Switchable in 1 click from /admin or editable field-by-field.

const PRESETS = {
  maple_laser: {
    nicheKey: "maple_laser",
    brandName: "MapleCraft™ Laser",
    brandLogoText: "MAPLECRAFT",
    brandTagline: "Canadian Hard Maple Artisan Engraving & Precision Diode Laser Systems",
    accentColor: "#c84b31",
    accentSecondary: "#d97706",
    darkBg: "#161311",
    announcement: "🍁 AUTUMN ARTISAN EVENT: Free Custom Laser Engraving + Free US/CA/EU Express Shipping on Orders $75+ | Code: MAPLE15",
    freeShippingThreshold: 75,
    enableLaserCustomizer: true,
    hero: {
      badge: "455nm Ultra-Fine 0.06mm Laser Precision • Handcrafted in North America",
      title: "Heirloom Maple Wood Meets Precision Laser Craft.",
      subtitle: "Design personalized Canadian Rock Maple gifts in our real-time laser studio, or bring industrial-grade engraving to your own workshop with MapleCraft™ optical diode laser systems.",
      ctaPrimary: "Launch Live Laser Customizer",
      ctaSecondary: "Explore Catalog"
    },
    categories: [
      { id: "all", name: "All Products" },
      { id: "custom-gifts", name: "Engraved Maple Gifts" },
      { id: "laser-machines", name: "Laser Engravers" },
      { id: "materials", name: "Maple Blanks & Kits" }
    ],
    products: [
      {
        id: "mc-board-01",
        title: "Heritage Canadian Rock Maple End-Grain Cutting Board (Custom Engraved)",
        category: "custom-gifts",
        price: 79.00,
        compareAtPrice: 115.00,
        rating: 4.9,
        reviews: 342,
        badge: "BEST SELLER",
        customizable: true,
        stock: 48,
        shortDesc: "2-inch thick kiln-dried Canadian hard maple butcher block, deep-relief laser engraved with your family crest, wedding date, or custom maple leaf motif.",
        specs: ["450 × 300 × 45 mm Canadian Sugar Maple", "0.35mm deep char-sealed laser engraving", "Seasoned with organic beeswax & mineral oil", "Includes gift box & care wax tin"],
        svgType: "cutting_board"
      },
      {
        id: "mc-laser-20w",
        title: "MapleCraft™ Pro 20W Optical Diode Laser Engraver & Air-Assist Cutter",
        category: "laser-machines",
        price: 549.00,
        compareAtPrice: 799.00,
        rating: 4.9,
        reviews: 189,
        badge: "PRO WORKSHOP",
        customizable: false,
        stock: 15,
        shortDesc: "Quad-diode 20,000mW compressed 0.06×0.08mm laser spot. Cuts 15mm solid maple wood in one pass and engraves stainless steel, slate, leather & anodized aluminum at 24,000 mm/min.",
        specs: ["20W Optical Power (4×5.5W FAC Diodes)", "400 × 400 mm working area, 24,000 mm/min", "Built-in 30L/min smart Air Assist pump", "LightBurn, LaserGRBL & Wi-Fi App compatible"],
        svgType: "laser_pro_20w"
      },
      {
        id: "mc-coasters-06",
        title: "Artisan Maple Leaf Laser-Etched Whiskey Coaster & Flight Set (6-Pack)",
        category: "custom-gifts",
        price: 49.00,
        compareAtPrice: 68.00,
        rating: 4.8,
        reviews: 276,
        badge: "GIFT FAVORITE",
        customizable: true,
        stock: 92,
        shortDesc: "Six solid hard-maple and black-walnut geometric coasters featuring precision botanical maple vein engraving and a matching laser-cut storage caddy.",
        specs: ["100mm diameter × 10mm solid hardwood", "Waterproof marine-grade satin tung oil finish", "Custom monogram or logo available on all 6 pieces", "Felt non-slip backing"],
        svgType: "coasters"
      },
      {
        id: "mc-crystal-3d",
        title: "3D Sub-Surface Laser Engraved K9 Optical Crystal Maple Leaf Night Lamp",
        category: "custom-gifts",
        price: 64.00,
        compareAtPrice: 89.00,
        rating: 4.9,
        reviews: 418,
        badge: "3D LASER ART",
        customizable: true,
        stock: 64,
        shortDesc: "180,000 internal micro-laser focal points suspended inside optical-grade K9 crystal, resting on an illuminated solid Canadian maple LED base with custom engraved plaque.",
        specs: ["80 × 80 × 120 mm flawless K9 optical crystal", "Warm 2700K dimmable solid maple wood base", "USB-C rechargeable (18h battery life)", "Free custom engraved dedication on wood base"],
        svgType: "crystal_maple"
      },
      {
        id: "mc-laser-mini",
        title: "MapleCraft™ Cube 5W Portable Desktop Laser Etcher + Maple Starter Kit",
        category: "laser-machines",
        price: 219.00,
        compareAtPrice: 299.00,
        rating: 4.7,
        reviews: 154,
        badge: "STARTER KIT",
        customizable: false,
        stock: 27,
        shortDesc: "Compact foldable Class-1 enclosed desktop laser engraver for makers, craft sellers, and home studios. Ships with 15 Canadian maple & leather blanks.",
        specs: ["5.5W Ultra-Fine 0.05mm FAC Diode Laser", "Protective eye-safe amber laser shield enclosure", "One-click smartphone & Mac/PC wireless control", "Includes 15 maple wood, slate & leather blanks"],
        svgType: "laser_mini"
      },
      {
        id: "mc-sign-brass",
        title: "Bespoke Solid Brass & Birdseye Maple Architectural Desk / Door Sign",
        category: "custom-gifts",
        price: 55.00,
        compareAtPrice: 78.00,
        rating: 5.0,
        reviews: 112,
        badge: "BESPOKE",
        customizable: true,
        stock: 39,
        shortDesc: "Fiber-laser deep-etched brushed brass inlaid into figured Canadian birdseye maple. Ideal for executive desks, studios, cabins, and boutique storefronts.",
        specs: ["220 × 75 × 28 mm Birdseye Maple + 2mm C260 Brass", "Permanent black oxidized fiber-laser lettering", "Includes desktop easel stand & hidden wall mounts", "Custom logo & typography support"],
        svgType: "brass_sign"
      },
      {
        id: "mc-blanks-24",
        title: "Master Maker's Canadian Maple, Walnut & Slate Laser Blank Box (24 Pcs)",
        category: "materials",
        price: 42.00,
        compareAtPrice: 59.00,
        rating: 4.9,
        reviews: 205,
        badge: "MAKER SUPPLY",
        customizable: false,
        stock: 120,
        shortDesc: "Kiln-dried, orbital-sanded to 320-grit, laser-ready hardwood and stone blanks calibrated for crisp, smoke-free diode and CO2 laser engraving.",
        specs: ["8× Hard Maple plaques, 8× Black Walnut tags, 8× Slate coasters", "Zero-knot furniture grade +/- 0.1mm flatness", "Pre-masked option for zero smoke residue", "Compatible with all 5W–40W diode & CO2 lasers"],
        svgType: "blanks_box"
      },
      {
        id: "mc-test-cent",
        title: "⚡ Live Payment Gateway Test Item ($0.01 USD Verification)",
        category: "materials",
        price: 0.01,
        compareAtPrice: 1.00,
        rating: 5.0,
        reviews: 99,
        badge: "TEST $0.01",
        customizable: true,
        stock: 999,
        shortDesc: "Dedicated $0.01 live checkout test item for verifying your PayPal Live / Sandbox payment flow and instant webhook order confirmation.",
        specs: ["Instant $0.01 USD live PayPal Orders v2 capture", "Verifies merchant ID UNQPMHDGVTL96 end-to-end", "Records custom engraving payload in /admin"],
        svgType: "test_badge"
      }
    ]
  },

  wool_slippers: {
    nicheKey: "wool_slippers",
    brandName: "ArtisanSteps™ Merino",
    brandLogoText: "ARTISANSTEPS",
    brandTagline: "100% Australian A-Grade Merino Sheepskin & Handcrafted Comfort Footwear",
    accentColor: "#9c6644",
    accentSecondary: "#b08968",
    darkBg: "#1b1613",
    announcement: "🐑 WINTER WARMTH SALE: 20% Off All Australian Twin-Face Sheepskin Slippers | Free Global Shipping $65+",
    freeShippingThreshold: 65,
    enableLaserCustomizer: false,
    hero: {
      badge: "100% Australian Merino Twin-Face Sheepskin • Direct From Artisan Tannery",
      title: "Step Into Cloud-Soft Australian Merino Warmth.",
      subtitle: "Naturally breathable, thermoregulating sheepskin slippers handcrafted with ergonomic memory-foam footbeds and indoor-outdoor gum rubber outsoles.",
      ctaPrimary: "Shop Best Sellers",
      ctaSecondary: "Explore Collection"
    },
    categories: [
      { id: "all", name: "All Footwear" },
      { id: "womens", name: "Women's Sheepskin" },
      { id: "mens", name: "Men's Moccasins" },
      { id: "care", name: "Wool Care & Insoles" }
    ],
    products: [
      {
        id: "as-slipper-01",
        title: "CloudWalk™ Australian Twin-Face Sheepskin Scuff Slipper (Chestnut)",
        category: "womens",
        price: 68.00,
        compareAtPrice: 98.00,
        rating: 4.9,
        reviews: 512,
        badge: "TOP RATED",
        customizable: false,
        stock: 85,
        shortDesc: "Plush 17mm Australian Merino sheepskin lining with water-resistant suede upper and lightweight EVA indoor/outdoor tread.",
        specs: ["100% Grade-A Australian Twin-Face Sheepskin", "17mm dense moisture-wicking wool pile", "Anti-slip indoor/outdoor gum rubber sole", "Sizes US 5–11"],
        svgType: "cutting_board"
      },
      {
        id: "as-moc-02",
        title: "Heritage Hand-Stitched Suede & Merino Shearling Loafer Moccasin",
        category: "mens",
        price: 79.00,
        compareAtPrice: 110.00,
        rating: 4.8,
        reviews: 284,
        badge: "BEST SELLER",
        customizable: false,
        stock: 60,
        shortDesc: "Classic whipstitch suede moccasin lined with thick natural shearling fleece and rawhide laces.",
        specs: ["Genuine water-repellent cow suede upper", "Removable sheepskin memory-foam insole", "Durable driving-style rubber pod outsole", "Sizes US 8–14"],
        svgType: "coasters"
      },
      {
        id: "as-test-cent",
        title: "⚡ Live Payment Gateway Test Item ($0.01 USD Verification)",
        category: "care",
        price: 0.01,
        compareAtPrice: 1.00,
        rating: 5.0,
        reviews: 99,
        badge: "TEST $0.01",
        customizable: false,
        stock: 999,
        shortDesc: "Dedicated $0.01 live checkout test item for verifying your PayPal Live / Sandbox payment flow.",
        specs: ["Instant $0.01 USD live PayPal Orders v2 capture"],
        svgType: "test_badge"
      }
    ]
  },

  aetheria_dtc: {
    nicheKey: "aetheria_dtc",
    brandName: "AETHERIA™ Global",
    brandLogoText: "AETHERIA",
    brandTagline: "Architectural Acoustic Living, Nordic Wellness & Precision Coffee Rituals",
    accentColor: "#0f766e",
    accentSecondary: "#14b8a6",
    darkBg: "#0f172a",
    announcement: "✨ COMPLIMENTARY WHITE-GLOVE EXPRESS SHIPPING ACROSS US, UK & EU ON ORDERS OVER $150",
    freeShippingThreshold: 150,
    enableLaserCustomizer: true,
    hero: {
      badge: "Curated European & North American Direct-to-Consumer Design Studio",
      title: "Objects of Permanence for the Modern Sanctuary.",
      subtitle: "Precision-engineered acoustic wood panels, solid brass espresso instruments, and bespoke laser-monogrammed architectural pieces.",
      ctaPrimary: "Custom Monogram Studio",
      ctaSecondary: "Browse Collection"
    },
    categories: [
      { id: "all", name: "All Collections" },
      { id: "acoustic", name: "Acoustic Wood Panels" },
      { id: "coffee", name: "Precision Espresso" },
      { id: "monogram", name: "Bespoke Monogram" }
    ],
    products: [
      {
        id: "ae-espresso-01",
        title: "Aetheria™ Monolith CNC Brass & Walnut Lever Espresso Station",
        category: "coffee",
        price: 389.00,
        compareAtPrice: 499.00,
        rating: 4.9,
        reviews: 167,
        badge: "FLAGSHIP",
        customizable: true,
        stock: 19,
        shortDesc: "Zero-electronics manual pressure-profiling espresso architecture milled from solid C360 brass and American walnut.",
        specs: ["9–11 Bar manual direct lever profiling", "58mm commercial stainless brew group", "Free custom laser-engraved walnut handle", "5-year international warranty"],
        svgType: "brass_sign"
      },
      {
        id: "ae-panel-02",
        title: "NordicSlat™ Acoustic American Walnut & Recycled Felt Wall System (4-Pack)",
        category: "acoustic",
        price: 249.00,
        compareAtPrice: 329.00,
        rating: 4.8,
        reviews: 230,
        badge: "ARCHITECTURAL",
        customizable: false,
        stock: 42,
        shortDesc: "NRC 0.85 studio-grade sound absorption panels crafted with real walnut veneer slats over 9mm acoustic PET felt.",
        specs: ["2400 × 600 × 21 mm per panel (Covers 5.76 m²)", "Class-A fire rating & zero-VOC finish", "15-minute modular flush installation"],
        svgType: "blanks_box"
      },
      {
        id: "ae-test-cent",
        title: "⚡ Live Payment Gateway Test Item ($0.01 USD Verification)",
        category: "monogram",
        price: 0.01,
        compareAtPrice: 1.00,
        rating: 5.0,
        reviews: 99,
        badge: "TEST $0.01",
        customizable: true,
        stock: 999,
        shortDesc: "Dedicated $0.01 live checkout test item for verifying your PayPal Live / Sandbox payment flow.",
        specs: ["Instant $0.01 USD live PayPal Orders v2 capture"],
        svgType: "test_badge"
      }
    ]
  }
};

module.exports = { PRESETS };
