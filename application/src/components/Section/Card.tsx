const style = {
  content: `bg-[#191B1F] w-[30rem] rounded-2xl p-4`,
  green: `bg-[#191B1F] w-[30rem] rounded-2xl p-4`,
yellow: `bg-[#191B1F] w-[30rem] rounded-2xl p-4`,
};

const Card = ({ children }: any) => {
  return (
    <div className="flex flex-col rounded-2xl px-6 sm:px-8">
      <div className={style.content}>{children}</div>
    </div>
  );
};

const GreenCard = ({ children }: any) => {
    return (
      <div className="flex flex-col rounded-2xl px-6 sm:px-8">
        <div className={style.green}>{children}</div>
      </div>
    );
  };

  const YellowCard = ({ children }: any) => {
    return (
      <div className="flex flex-col rounded-2xl px-6 sm:px-8">
        <div className={style.yellow}>{children}</div>
      </div>
    );
  };

// export default Card;
export { Card, GreenCard, YellowCard };
