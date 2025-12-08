import Button from '../UI/Button';

const Hero: React.FC = () => {
  return (
    <div className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image - Placeholder for Volcano */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/id/1018/1920/1080" 
          alt="Mount Bromo Landscape" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center text-white mt-16">
        <div className="inline-block bg-jvto-green text-jvto-dark text-xs font-black uppercase tracking-widest px-3 py-1 mb-6 animate-fade-in-up">
          Licensed & Police-Led Operations
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 uppercase tracking-tight max-w-5xl mx-auto">
          Tourist Police-Led <br/> Private Volcano Tours <br/> in East Java
        </h1>
        
        <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light">
          Join solo-friendly, expert-led private adventures to Bromo, Ijen, and Tumpak Sewu. 
          Clear written policies and health screening included.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button variant="primary" size="lg">
            Browse Private Tours
          </Button>
          <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
            Verify JVTO
          </Button>
        </div>
      </div>

      {/* Bottom overlay info */}
      <div className="absolute bottom-8 left-0 right-0 z-10 text-white text-center text-xs opacity-70">
        <p>Licensed East Java tour operator in Bondowoso | Active Tourist Police Officer Led</p>
      </div>
    </div>
  );
};

export default Hero;