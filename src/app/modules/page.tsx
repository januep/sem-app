import Link from 'next/link';
import Header from '@/app/components/Header';

const modules = [
  { 
    id: 'office-safety', 
    title: 'Office Health & Safety Quiz',
    description: 'Learn essential workplace safety procedures and best practices.',
    questions: 2,
    estimatedTime: '5 minutes',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  { 
    id: 'fire-safety', 
    title: 'Fire Safety Training',
    description: 'Understand fire prevention, evacuation procedures, and emergency response.',
    questions: 0,
    estimatedTime: 'Coming soon',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
      </svg>
    )
  },
  { 
    id: 'ergonomics', 
    title: 'Ergonomics at Work',
    description: 'Learn how to set up your workspace to prevent strain and injury.',
    questions: 0,
    estimatedTime: 'Coming soon',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
];

export default function ModulesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">Training Modules</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select a training module to enhance your workplace knowledge and safety skills
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => {
              const isAvailable = module.questions > 0;
              
              return (
                <div 
                  key={module.id}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden transition duration-300 ${
                    isAvailable ? 'hover:shadow-xl transform hover:-translate-y-1' : 'opacity-75'
                  }`}
                >
                  <div className="p-6">
                    <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                      {module.icon}
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">{module.title}</h2>
                    <p className="text-gray-600 mb-4">{module.description}</p>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-5">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Questions: {module.questions}
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {module.estimatedTime}
                      </div>
                    </div>
                    
                    {isAvailable ? (
                      <Link 
                        href={`/modules/${module.id}`} 
                        className="block w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-center rounded-xl transition duration-300"
                      >
                        Start Module
                      </Link>
                    ) : (
                      <div className="block w-full py-3 px-4 bg-gray-300 text-gray-600 font-medium text-center rounded-xl cursor-not-allowed">
                        Coming Soon
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}