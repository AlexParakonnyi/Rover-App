const Header: React.FC = () => {
  return (
    <header className="hidden sm:flex justify-between items-center p-4 bg-indigo-900 bg-opacity-20 backdrop-blur-md fixed w-full top-0 z-10">
      <div className="flex items-center ml-12">
        <div className="w-12 h-12 bg-[url('/123.png')] bg-no-repeat bg-center bg-cover"></div>
        <div className="ml-4 text-white text-2xl font-bold text-shadow-md">
          Cardboard Rover
        </div>
      </div>
    </header>
  );
};

export default Header;
