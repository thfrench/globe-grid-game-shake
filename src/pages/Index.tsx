
import FlagGame from '@/components/FlagGame';

const Index = () => {
  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/70 to-indigo-800/70"></div>
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-6 px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
            Flag Quest
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Test your geography knowledge with our exciting flag games!
          </p>
        </div>
        <FlagGame />
      </div>
    </div>
  );
};

export default Index;
