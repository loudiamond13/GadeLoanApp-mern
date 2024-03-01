import Footer from '../components/Footer';
import Header from '../components/Header'; 
import Hero from '../components/Hero';


interface Props{
  children: React.ReactNode;
}

const Layout =({children}:Props)=>{
  return(
    <div className=" bg-light d-flex flex-column">
      <Header/>
      <Hero/>
      <div className="container mx-auto py-5 min-vh-100">{children}</div>
      <div className=''>
      <Footer/>
      </div>
    </div>
  );

};

export default Layout;