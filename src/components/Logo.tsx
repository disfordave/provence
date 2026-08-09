export default function Logo({
  size,
}: {
  size?:
    "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";
}) {
  return (
    <div
      className={`text-center font-black tracking-tighter text-nowrap uppercase ${getLogoSizeClass(size)}`}
    >
      La langue
      <br />
      française
    </div>
  );
}

function getLogoSizeClass(
  size?:
    "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl",
) {
  switch (size) {
    case "xs":
      return "text-xs leading-2.5";
    case "sm":
      return "text-sm leading-[11px]";
    case "base":
      return "text-base leading-[13px]";
    case "lg":
      return "text-lg leading-3.5";
    case "xl":
      return "text-xl leading-4";
    case "2xl":
      return "text-2xl leading-5";
    case "3xl":
      return "text-3xl leading-6";
    case "4xl":
      return "text-4xl leading-7";
    case "5xl":
      return "text-5xl leading-9.5";
    case "6xl":
      return "text-6xl leading-11.5";
    default:
      return "text-base leading-[13px]";
  }
}
