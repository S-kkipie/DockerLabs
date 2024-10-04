import perfil from "../assets/perfil.avif";
function HomePage() {
  return (
    <div className="flex m-8 gap-8">
      <div className="w-1/3 px-8 py-12 bg-card flex flex-col gap-5 items-center justify-center rounded border">
        <img
          className="rounded-full w-96 "
          src={perfil}
          alt=""
        />
        <h1 className="text-3xl text-primary font-bold">Adrian Issac</h1>
        <h3 className="text-primary">I am a web developer and I am learning pentesting</h3>
      </div>
      <div className="w-2/3 px-8 bg-card py-12 rounded border h-full">
      <h1 className="font-bold text-md">Hell0 ther3!</h1>
      <h1 className="text-4xl font-semibold mt-2">I'm a Adrian Issac,I am a Fullstack Developer with a focus on Front-End and one year of experience. I
      specialize in creating intuitive and functional interfaces, integrating design and development.</h1>
      </div>
    </div>
  );
}

export default HomePage;
