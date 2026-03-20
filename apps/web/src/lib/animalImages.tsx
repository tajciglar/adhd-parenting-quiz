export const ANIMAL_IMAGE: Record<string, string> = {
  koala: "/animals/koala.png",
  hummingbird: "/animals/hummingbird.png",
  tiger: "/animals/tiger.png",
  meerkat: "/animals/meerkat.png",
  stallion: "/animals/stallion.png",
  fox: "/animals/fox.png",
  rabbit: "/animals/rabbit.png",
  elephant: "/animals/elephant.png",
  dolphin: "/animals/dolphin.png",
  hedgehog: "/animals/hedgehog.png",
  bull: "/animals/bull.png",
  red_panda: "/animals/redpanda.png",
  panda: "/animals/cloudypanda.png",
  firefly: "/animals/spark_firefly.png",
  penguin: "/animals/penguin.png",
  eagle: "/animals/eagle.png",
  deer: "/animals/deer.png",
  bear: "/animals/bear.png",
  bee: "/animals/bee.png",
  owl: "/animals/owl.png",
  octopus: "/animals/octopus.png",
  swan: "/animals/swan.png",
  bunny: "/animals/bunny.png",
  tender_hedgehog: "/animals/tender_hedgehog.png",
  hidden_firefly: "/animals/hidden_firefly.png",
};

export function AnimalIcon({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  const src = ANIMAL_IMAGE[id];
  if (!src) return <span className={className}>🧠</span>;
  return <img src={src} alt={id} className={`${className} object-contain`} />;
}
