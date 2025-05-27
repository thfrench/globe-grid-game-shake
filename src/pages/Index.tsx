
import FlagGame from '@/components/FlagGame';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Flag Quest</h1>
          <p className="text-lg text-gray-600">Test your geography knowledge by clicking the correct flag!</p>
        </div>
        <FlagGame />
      </div>
    </div>
  );
};

export default Index;
