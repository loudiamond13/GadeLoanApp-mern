const Footer = ()=>{
  return(
    <div className="bg-dark py-3 ">
      <div className="container mx-auto d-row d-flex justify-between items-center">
        <span className="fw-3 fs-4 text-light col fw-bold">
          GadeLLC.com
        </span>
        <span className="text-light fw-medium  d-flex gap-4 ">
          <a href="/" className="text-decoration-none text-light">Privacy Policy</a>
          <a href="/" className="text-decoration-none text-light"> Terms of Service</a>
        </span>
      </div>
    </div> 
  );
};

export default Footer;