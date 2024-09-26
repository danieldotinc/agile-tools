'use client';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const apps = [
    {
      heading: 'Refinement',
      subheading: `Do you have some tickets to estimate?`,
      message: '1. create a polling game 🃏\n2. add user stories 💡\n3. share the link 🔗',
      link: '/refinement',
      ready: true,
    },
    {
      heading: 'Pre-Refinement',
      subheading: 'Decide on a team and a pre-refinement ninja!',
      message: "1. add user stories 💡\n2. drop it in a team's bucket 🪣\n3. assign a ninja 🥷🏻",
      link: '/pre-refinement',
      ready: true,
    },
    {
      heading: 'Sprint Metrics',
      subheading: 'Want to know how teams are doing?',
      message: 'under construction!',
      link: '/metrics',
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
                className={`shadow-md hover:shadow-3xl cursor-pointer rounded-lg border p-4 hover:bg-gray-100 border-gray-200 ${
                  index > 1 && 'hidden md:block'
                }`}
                onClick={() => !!example.link && router.push(example.link)}
              >
                <div className="text-lg">{example.heading}</div>
                <div className="text-lg text-zinc-500">{example.subheading}</div>
                <div className={`text-lg ${example.ready ? 'text-orange-500' : 'text-red-700'}`}>
                  <pre>{example.message}</pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
