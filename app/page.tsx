'use client';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const apps = [
    {
      heading: 'Refinement',
      subheading: `Do you have some tickets to estimate?`,
      message: `1.create a polling game 2.add user stories 3.share the link`,
      link: '/poker',
      ready: true,
    },
    {
      heading: 'Sprint Capacity',
      subheading: 'Do you want an estimate for capacity for next sprint?',
      message: 'under construction!',
      ready: false,
    },
    {
      heading: 'Coffee Call Games',
      subheading: 'Do you want to play some games with the team?',
      message: `under construction!`,
      ready: false,
    },
    {
      heading: 'Tool Ideas',
      subheading: `Do you have a tool idea?`,
      message: `under construction!`,
      ready: false,
    },
  ];

  return (
    <div className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
      <main className="fixed inset-x-0 w-full peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
        <div className="mx-auto sm:max-w-4xl sm:px-4">
          <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">
            {apps.map((example, index) => (
              <div
                key={example.heading}
                className={`shadow-lg hover:shadow-3xl cursor-pointer rounded-lg border p-4 hover:bg-zinc-800 ${
                  index > 1 && 'hidden md:block'
                }`}
                onClick={() => !!example.link && router.push(example.link)}
              >
                <div className="text-sm font-semibold">{example.heading}</div>
                <div className="text-sm text-zinc-600">
                  {example.subheading}
                </div>
                <div
                  className={`text-sm ${
                    example.ready ? 'text-yellow-500' : 'text-red-700'
                  }`}
                >
                  {example.message}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
