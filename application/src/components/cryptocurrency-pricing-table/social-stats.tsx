import React from 'react';

export const socialStats = [
  {
    name: 'GitHub Commits',
    value: '238',
  },
  {
    name: 'GitHub Stars',
    value: '3,694',
  },
  {
    name: 'GitHub Forks',
    value: '2,054',
  },
  {
    name: 'GitHub Contributors',
    value: '30',
  },
  {
    name: 'Github Followers',
    value: '511',
  },
  {
    name: 'Twitter Followers',
    value: '9,118,125',
  },
  {
    name: 'Reddit Members',
    value: '1,000,000',
  },
];

function SocialStats() {
  return (
    <div className="mt-6 rounded-lg bg-white px-4 py-8 shadow-card dark:bg-light-dark md:p-8">
      <h2 className="text-xl font-medium uppercase text-black dark:text-white">
        Social Stats
      </h2>
      <div className="mt-8 grid grid-cols-1 items-center gap-4 sm:grid-cols-2 md:grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] md:gap-8">
        {socialStats.map((stat, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white px-8 pb-7 pt-6 transition-all hover:shadow-card dark:border-slate-500 dark:bg-light-dark"
          >
            <div className="text-gray-500 dark:text-gray-400">{stat.name}</div>
            <div className="text-base font-medium text-black dark:text-white">
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SocialStats;
