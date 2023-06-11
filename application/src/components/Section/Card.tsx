const style = {
  content: `bg-[#191B1F] w-[30rem] rounded-2xl p-4`,
};

const Card = ({ children }: any) => {
  return (
    <div className="flex flex-col rounded-2xl px-6 sm:px-8">
      <div className={style.content}>{children}</div>
    </div>
  );
};

export default Card;
