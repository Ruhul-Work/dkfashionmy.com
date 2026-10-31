import ClothingRailHero from '../components/ui/product-rail-gallery'
import type { RailGarment } from '../components/ui/product-rail-gallery'


export const RAIL_DEMO_ITEMS: RailGarment[] = [
  {
    id: "bone-tee",
    name: "Heavyweight tee · Bone",
    kind: "tee",
    color: "#EFEBE2",
    tag: "$48",
    description: "240 gsm organic cotton with a tonal DHxWHY embroidery on the chest.",
    details: ["240 gsm", "Regular fit", "Tonal embroidery"],
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
    description: "Black tee with the CCgather wordmark printed front and back.",
    details: ["240 gsm", "Regular fit", "Screen print"],
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
    description: "Pale sky oxford with a button-down collar and a tiny Maestiq embroidery.",
    details: ["Oxford cotton", "Button-down collar", "Chest pocket"],
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
    description: "Chunky olive wool cardigan with wooden buttons and ribbed trims.",
    details: ["Lambswool", "Wooden buttons", "V-neck"],
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
    description: "Heather fleece hoodie with the Maestiq wordmark across the chest.",
    details: ["400 gsm fleece", "Kangaroo pocket", "Chest print"],
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
    description: "Muted lilac fleece crewneck with a raised DHxWHY puff print.",
    details: ["400 gsm fleece", "Ribbed trims", "Puff print"],
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
    description: "Forest piqué polo with a bone CCgather embroidery on the chest.",
    details: ["Piqué knit", "Two-button placket", "Embroidered"],
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
    description: "Dusty brick henley with a three-button placket, worn in from day one.",
    details: ["Slub cotton", "Three buttons", "Long sleeve"],
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
    description: "Classic ink-and-bone Breton stripe with a boat neck.",
    details: ["220 gsm", "Boat neck", "Long sleeve"],
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
    description: "Boxy ochre tee with a small chest mark and a large CCgather back print.",
    details: ["Oversized", "Dropped shoulder", "Back print"],
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
        eyebrow="New season · Ten pieces on the rail"
        heading="A clothing rail you can handle, right on the page."
        caption="Brush along the rail, slide a hanger, lift a piece to see the back."
        autoplay
        action={
          <button type="button" className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-sm outline-none transition-[transform,box-shadow] hover:-translate-y-px hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none">
            Shop Now
          </button>
        }
      />
    </div>
  )
}





