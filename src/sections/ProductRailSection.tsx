import ClothingRailHero from '../components/ui/product-rail-gallery'
import type { RailGarment } from '../components/ui/product-rail-gallery'
import { Link } from 'react-router-dom'


export const RAIL_DEMO_ITEMS: RailGarment[] = [
  {
    id: "bone-tee",
    name: "Heavyweight tee · Bone",
    kind: "tee",
    color: "#EFEBE2",
    tag: "$48",
    material: "100% organic cotton",
    fit: "Regular fit",
    care: "Machine wash cold",
    colorName: "Bone",
    sku: "DK-TEE-001",
    description: "240 gsm organic cotton with a tonal DHxWHY embroidery on the chest.",
    details: ["240 gsm", "Regular fit", "Tonal embroidery", "Machine wash cold", "Sizes S–XL"],
    image: "/dummy-product/rail-01.webp",
    backImage: "/dummy-product/rail-02.webp",
    sideImage: "/dummy-product/rail-03.webp",
  },
  {
    id: "cc-graphic",
    name: "Graphic tee · CCgather",
    kind: "tee",
    color: "#101214",
    tag: "$52",
    material: "Soft cotton jersey",
    fit: "Regular fit",
    care: "Wash inside out",
    colorName: "Carbon black",
    sku: "DK-TEE-002",
    description: "Black tee with the CCgather wordmark printed front and back.",
    details: ["240 gsm", "Regular fit", "Screen print", "Soft cotton jersey", "Sizes S–XL"],
    image: "/dummy-product/rail-04.webp",
    backImage: "/dummy-product/rail-05.webp",
    sideImage: "/dummy-product/rail-06.webp",
  },
  {
    id: "oxford-sky",
    name: "Oxford shirt · Sky",
    kind: "shirt",
    color: "#A3D3EB",
    tag: "$74",
    material: "100% Oxford cotton",
    fit: "Relaxed fit",
    care: "Easy iron, low heat",
    colorName: "Sky blue",
    sku: "DK-SHR-003",
    description: "Pale sky oxford with a button-down collar and a tiny Maestiq embroidery.",
    details: ["Oxford cotton", "Button-down collar", "Chest pocket", "Easy iron", "Sizes S–XL"],
    image: "/dummy-product/rail-07.webp",
    backImage: "/dummy-product/rail-08.webp",
    sideImage: "/dummy-product/rail-09.webp",
  },
  {
    id: "cardigan-olive",
    name: "Knit cardigan · Olive",
    kind: "knit",
    color: "#758151",
    tag: "$96",
    material: "Lambswool blend",
    fit: "Relaxed fit",
    care: "Dry clean only",
    colorName: "Olive",
    sku: "DK-KNT-004",
    description: "Chunky olive wool cardigan with wooden buttons and ribbed trims.",
    details: ["Lambswool", "Wooden buttons", "V-neck", "Relaxed fit", "Dry clean recommended"],
    image: "/dummy-product/rail-10.webp",
    backImage: "/dummy-product/rail-11.webp",
    sideImage: "/dummy-product/rail-12.webp",
  },
  {
    id: "hoodie-heather",
    name: "Hoodie · Maestiq",
    kind: "hoodie",
    color: "#A0A5AB",
    tag: "$88",
    material: "400 gsm cotton fleece",
    fit: "Relaxed fit",
    care: "Machine wash cold",
    colorName: "Heather grey",
    sku: "DK-HOD-005",
    description: "Heather fleece hoodie with the Maestiq wordmark across the chest.",
    details: ["400 gsm fleece", "Kangaroo pocket", "Chest print", "Brushed interior", "Sizes S–XL"],
    image: "/dummy-product/rail-13.webp",
    backImage: "/dummy-product/rail-14.webp",
    sideImage: "/dummy-product/rail-15.webp",
  },
  {
    id: "sweat-lilac",
    name: "Crewneck sweatshirt · Lilac",
    kind: "knit",
    color: "#CCB2E0",
    tag: "$78",
    material: "400 gsm brushed fleece",
    fit: "Drop shoulder",
    care: "Wash with similar colours",
    colorName: "Muted lilac",
    sku: "DK-SWT-006",
    description: "Muted lilac fleece crewneck with a raised DHxWHY puff print.",
    details: ["400 gsm fleece", "Ribbed trims", "Puff print", "Drop shoulder", "Sizes S–XL"],
    image: "/dummy-product/rail-16.webp",
    backImage: "/dummy-product/rail-17.webp",
    sideImage: "/dummy-product/rail-18.webp",
  },
  {
    id: "polo-forest",
    name: "Piqué polo · Forest",
    kind: "tee",
    color: "#185B37",
    tag: "$62",
    material: "Breathable piqué cotton",
    fit: "Regular fit",
    care: "Machine wash cold",
    colorName: "Forest green",
    sku: "DK-POL-007",
    description: "Forest piqué polo with a bone CCgather embroidery on the chest.",
    details: ["Piqué knit", "Two-button placket", "Embroidered", "Breathable weave", "Sizes S–XL"],
    image: "/dummy-product/rail-19.webp",
    backImage: "/dummy-product/rail-20.webp",
    sideImage: "/dummy-product/rail-21.webp",
  },
  {
    id: "henley-brick",
    name: "Henley · Brick",
    kind: "knit",
    color: "#B05139",
    tag: "$56",
    material: "Slub cotton jersey",
    fit: "Relaxed fit",
    care: "Wash inside out",
    colorName: "Dusty brick",
    sku: "DK-HEN-008",
    description: "Dusty brick henley with a three-button placket, worn in from day one.",
    details: ["Slub cotton", "Three buttons", "Long sleeve", "Relaxed fit", "Sizes S–XL"],
    image: "/dummy-product/rail-22.webp",
    backImage: "/dummy-product/rail-23.webp",
    sideImage: "/dummy-product/rail-24.webp",
  },
  {
    id: "breton",
    name: "Breton long sleeve",
    kind: "knit",
    color: "#E4DFD3",
    tag: "$58",
    material: "220 gsm organic cotton",
    fit: "Regular fit",
    care: "Machine wash cold",
    colorName: "Ink and bone",
    sku: "DK-BRT-009",
    description: "Classic ink-and-bone Breton stripe with a boat neck.",
    details: ["220 gsm", "Boat neck", "Long sleeve", "Organic cotton", "Sizes S–XL"],
    image: "/dummy-product/rail-25.webp",
    backImage: "/dummy-product/rail-26.webp",
    sideImage: "/dummy-product/rail-27.webp",
  },
  {
    id: "oversized-ochre",
    name: "Oversized tee · CCgather",
    kind: "tee",
    color: "#DE9C31",
    tag: "$52",
    material: "Midweight cotton",
    fit: "Oversized fit",
    care: "Wash inside out",
    colorName: "Ochre",
    sku: "DK-TEE-010",
    description: "Boxy ochre tee with a small chest mark and a large CCgather back print.",
    details: ["Oversized", "Dropped shoulder", "Back print", "Midweight cotton", "Sizes S–XL"],
    image: "/dummy-product/rail-28.webp",
    backImage: "/dummy-product/rail-29.webp",
    sideImage: "/dummy-product/rail-30.webp",
  },
];


export default function ProductRailSection() {
  return (
    <div data-rail-demo className="flex w-full items-center justify-center bg-background text-foreground">
      <ClothingRailHero
        items={RAIL_DEMO_ITEMS}
        hanger="none"
        eyebrow="Craft-first · For him & for her"
        heading="Clothing that carries calm"
        caption="Tailored in small batches, worn for years. Natural fabrics, quiet tailoring and everyday pieces made to stay in rotation."
        autoplay
        action={
          <Link
            to="/shop"
            className="inline-flex items-center justify-center rounded-full bg-foreground px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-background transition-colors hover:bg-caramel hover:text-background"
          >
            Shop the pieces
          </Link>
        }
      />
    </div>
  )
}
