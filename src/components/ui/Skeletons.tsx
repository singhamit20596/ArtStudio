/** Placeholders shown for a moment while a product or listing page streams in. */

const bar = "block bg-brown/20 animate-pulse motion-reduce:animate-none";

export function ListingSkeleton() {
  return (
    <div className="container-x pb-20" aria-busy="true" aria-label="Loading">
      <div className="pt-6 pb-8 md:pt-8 md:pb-12">
        <span className={`${bar} h-3 w-40`} />
        <span className={`${bar} mt-12 h-3 w-28`} />
        <span className={`${bar} mt-4 h-10 w-64 max-w-full`} />
        <span className={`${bar} mt-5 h-4 w-96 max-w-full`} />
      </div>
      <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:ml-[268px]">
        {Array.from({ length: 6 }, (_, i) => (
          <li key={i}>
            <span className={`${bar} aspect-[4/5]`} />
            <span className={`${bar} mt-3.5 h-3 w-4/5`} />
            <span className={`${bar} mt-2 h-3 w-1/3`} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div className="container-x pt-5 pb-16 md:pt-6" aria-busy="true" aria-label="Loading">
      <span className={`${bar} h-3 w-56`} />
      <div className="mt-5 grid gap-8 md:mt-8 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-12 lg:gap-16">
        <span className={`${bar} -mx-4 aspect-[4/5] md:mx-0`} />
        <div>
          <span className={`${bar} h-3 w-32`} />
          <span className={`${bar} mt-4 h-8 w-4/5`} />
          <span className={`${bar} mt-5 h-6 w-24`} />
          <span className={`${bar} mt-10 h-12 w-full`} />
          <span className={`${bar} mt-3 h-12 w-full`} />
        </div>
      </div>
    </div>
  );
}
