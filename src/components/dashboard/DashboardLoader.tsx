
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const DashboardLoader = () => {
  return (
    <>
      <Navigation />
      <main className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <p className="text-center">Loading...</p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DashboardLoader;
