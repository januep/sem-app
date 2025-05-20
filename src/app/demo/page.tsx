'use client'
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Map, Droplet, Leaf, MapPin } from 'lucide-react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

// Types
type RegionData = {
  name: string;
  area: string;
  mainFeatures: string;
};

type CarouselItem = {
  id: number;
  title: string;
  description: string;
  image: string;
  color: string;
};

type FactItem = {
  label: string;
  value: string;
};

type NavigationItemProps = {
  icon: React.FC<{ size?: number | string }>;
  label: string;
  active: boolean;
  onClick: () => void;
};

type ProgressBarProps = {
  value: number;
  max: number;
};

// Helper components with TypeScript
const ProgressBar: React.FC<ProgressBarProps> = ({ value, max }) => {
  const percentage = (value / max) * 100;
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
      <div 
        className="bg-primary h-2.5 rounded-full transition-all duration-500" 
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

const NavigationItem: React.FC<NavigationItemProps> = ({ icon: Icon, label, active, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center space-x-2 p-2 rounded-lg w-full transition-all ${
        active ? 'bg-primary/10 text-primary' : 'hover:bg-primary/5'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );
};

// Main component
const PolandGeographyCourse: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [progress, setProgress] = useState<number>(28);

  // Data
  const carouselItems: CarouselItem[] = [
    {
      id: 1,
      title: "The Baltic Coast",
      description: "Poland's northern border features 440 km of coastline along the Baltic Sea, with beautiful sandy beaches and coastal landscapes.",
      image: "/api/placeholder/800/400",
      color: "bg-blue-500"
    },
    {
      id: 2,
      title: "The Tatra Mountains",
      description: "The highest mountain range in Poland, part of the Carpathian Mountains, with Rysy peak reaching 2,499 meters above sea level.",
      image: "/api/placeholder/800/400",
      color: "bg-gray-500"
    },
    {
      id: 3,
      title: "Masurian Lake District",
      description: "A region containing more than 2,000 lakes, known as 'The Land of a Thousand Lakes', perfect for sailing and water activities.",
      image: "/api/placeholder/800/400",
      color: "bg-emerald-500"
    },
    {
      id: 4,
      title: "Białowieża Forest",
      description: "One of the last and largest remaining parts of the immense primeval forest that once stretched across the European Plain.",
      image: "/api/placeholder/800/400",
      color: "bg-green-600"
    }
  ];

  const regionData: RegionData[] = [
    { name: 'North (Baltic Coast)', area: '18%', mainFeatures: 'Coastline, Dunes, Gdańsk Bay' },
    { name: 'South (Mountains)', area: '8%', mainFeatures: 'Tatras, Sudetes, Carpathians' },
    { name: 'Central (Lowlands)', area: '54%', mainFeatures: 'Plains, River valleys, Urban centers' },
    { name: 'East (Forests)', area: '20%', mainFeatures: 'Ancient woodlands, National parks, Wildlife' },
  ];

  const factsData: FactItem[] = [
    { label: 'Area', value: '312,696 km²' },
    { label: 'Population', value: '38 million' },
    { label: 'Capital', value: 'Warsaw' },
    { label: 'Longest River', value: 'Vistula (1,047 km)' },
    { label: 'Highest Point', value: 'Rysy (2,499m)' },
    { label: 'Largest Lake', value: 'Śniardwy' },
    { label: 'Forest Coverage', value: '29.6%' },
    { label: 'Coastline', value: '440 km' }
  ];

  // Carousel controls
  const handlePrevious = (): void => {
    setActiveSlide((prev) => (prev === 0 ? carouselItems.length - 1 : prev - 1));
  };

  const handleNext = (): void => {
    setActiveSlide((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [activeSlide]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <div className="flex flex-1">
        {/* Sidebar - hidden on mobile */}
        <div className="hidden md:flex flex-col w-64 border-r bg-white p-4">
          <div className="mb-6">
            <h2 className="text-sm font-semibold mb-2">COURSE PROGRESS</h2>
            <ProgressBar value={progress} max={100} />
            <p className="text-sm text-gray-500 mt-1">{progress}% Complete</p>
          </div>
          
          <Separator className="my-4" />
          
          <nav className="space-y-1">
            <NavigationItem icon={MapPin} label="Overview" active={true} onClick={() => {}} />
            <NavigationItem icon={Map} label="Landscapes" active={false} onClick={() => {}} />
            <NavigationItem icon={Droplet} label="Water Bodies" active={false} onClick={() => {}} />
            <NavigationItem icon={Leaf} label="Ecosystems" active={false} onClick={() => {}} />
          </nav>
          
          <div className="mt-auto pt-6">
            <Button className="w-full">Continue Learning</Button>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {/* Hero section */}
          <div className="relative bg-slate-900 text-white">
            <div className="absolute inset-0 opacity-30">
              <img 
                src="/api/placeholder/1200/400" 
                alt="Poland landscape" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative container mx-auto px-4 py-16 md:py-24">
              <div>
                <h1 className="text-3xl md:text-5xl font-bold mb-4">
                  Discover Poland's Geography
                </h1>
                <p className="text-lg md:text-xl max-w-2xl mb-8 text-slate-200">
                  Explore the diverse landscapes, from the Baltic shores to the Tatra mountains, 
                  through a comprehensive journey across Poland's geographical wonders.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button>Start Learning</Button>
                  <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-slate-900">
                    View Module Map
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Featured landscapes carousel */}
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Key Geographic Regions</h2>
              <p className="text-slate-600 mb-8">Swipe through Poland's most significant landscapes</p>
              
              {/* Carousel Component */}
              <div className="relative">
                <div className="overflow-hidden rounded-xl">
                  <div className="relative aspect-[16/9] md:aspect-[21/9]">
                    <div className="absolute inset-0">
                      <div className={`absolute inset-0 ${carouselItems[activeSlide].color} opacity-80`}></div>
                      <img 
                        src={carouselItems[activeSlide].image} 
                        alt={carouselItems[activeSlide].title}
                        className="w-full h-full object-cover mix-blend-overlay"
                      />
                      <div className="absolute inset-0 flex items-end p-6 md:p-12 text-white">
                        <div>
                          <h3 className="text-2xl md:text-4xl font-bold mb-2">
                            {carouselItems[activeSlide].title}
                          </h3>
                          <p className="max-w-xl text-sm md:text-base">
                            {carouselItems[activeSlide].description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Carousel controls */}
                <div className="absolute inset-y-0 left-0 flex items-center">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handlePrevious}
                    className="rounded-full bg-white/70 backdrop-blur-sm border-none hover:bg-white ml-2"
                  >
                    <ChevronLeft />
                  </Button>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleNext}
                    className="rounded-full bg-white/70 backdrop-blur-sm border-none hover:bg-white mr-2"
                  >
                    <ChevronRight />
                  </Button>
                </div>
                
                {/* Dots indicator */}
                <div className="absolute bottom-4 left-0 right-0">
                  <div className="flex justify-center space-x-2">
                    {carouselItems.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === activeSlide ? 'bg-white w-6' : 'bg-white/50'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Tabbed content section */}
          <section className="py-12 bg-slate-50">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold mb-8">Explore Geographic Elements</h2>
              
              <Tabs defaultValue="landscape" className="w-full">
                <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 mb-8">
                  <TabsTrigger value="landscape">Landscapes</TabsTrigger>
                  <TabsTrigger value="climate">Climate</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>
                
                <TabsContent value="landscape">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Card>
                        <CardHeader>
                          <CardTitle>Diverse Terrain</CardTitle>
                          <CardDescription>Poland's varying elevation creates distinct regions</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <img src="/api/placeholder/600/300" alt="Terrain map" className="w-full rounded-md mb-4" />
                          <p className="text-slate-600">
                            Poland's topography transitions gradually from the flat central plains to the 
                            mountainous south, creating distinct geographical regions each with their own 
                            unique ecosystems and climates.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div>
                      <Card>
                        <CardHeader>
                          <CardTitle>Regional Breakdown</CardTitle>
                          <CardDescription>Key geographic regions by area</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {regionData.map((region, index) => (
                              <div key={index} className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">{region.name}</p>
                                  <p className="text-xs text-slate-500">{region.mainFeatures}</p>
                                </div>
                                <div className="text-right">
                                  <span className="text-lg font-bold">{region.area}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="climate">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <Card>
                        <CardHeader>
                          <CardTitle>Temperate Climate</CardTitle>
                          <CardDescription>Poland experiences all four seasons distinctly</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {['Winter', 'Spring', 'Summer', 'Fall'].map((season) => (
                              <div key={season} className="bg-slate-100 p-4 rounded-lg text-center">
                                <p className="font-medium">{season}</p>
                              </div>
                            ))}
                          </div>
                          <p className="text-slate-600">
                            Poland has a temperate climate with relatively cold winters and warm summers. 
                            The climate is influenced by oceanic air currents from the west, cold polar air from 
                            Scandinavia and Russia, and warmer, subtropical air from the south.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="resources">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['Coal Deposits', 'Fertile Soil', 'Forest Resources'].map((resource) => (
                      <div key={resource}>
                        <Card className="h-full">
                          <CardHeader>
                            <CardTitle className="text-lg">{resource}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-slate-600">
                              Poland has abundant {resource.toLowerCase()}, which have been crucial 
                              to its economic development throughout history.
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </section>

          {/* Interactive map section */}
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="md:w-1/3">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Explore the Map</h2>
                  <p className="text-slate-600 mb-6">
                    Poland is located in Central Europe, bordered by Germany to the west, the Czech Republic and 
                    Slovakia to the south, Ukraine and Belarus to the east, and the Baltic Sea, Lithuania, and 
                    Russia to the north.
                  </p>
                  <Button>Open Interactive Map</Button>
                </div>
                <div className="md:w-2/3 rounded-xl overflow-hidden border shadow-sm">
                  <div className="aspect-[16/10] bg-slate-200 flex items-center justify-center">
                    <div className="text-center p-8">
                      <MapPin size={48} className="mx-auto text-slate-400 mb-2" />
                      <p className="text-slate-500">Interactive map would display here</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Facts Section */}
          <section className="py-12 bg-slate-50">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold mb-8">Poland at a Glance</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {factsData.map((fact, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-slate-500">{fact.label}</p>
                    <p className="text-lg font-bold">{fact.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Call to action */}
          <section className="py-12 bg-primary text-white">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to continue your journey?</h2>
              <p className="max-w-2xl mx-auto mb-8">
                Explore more modules about Poland's geography, from river systems to urban development.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="secondary">Next Module</Button>
                <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
                  Download Materials
                </Button>
              </div>
            </div>
          </section>
        </main>
      </div>
      
      <footer className="bg-slate-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center gap-2">
                <MapPin size={20} />
                <span className="font-semibold">PolandGeo Explorer</span>
              </div>
            </div>
            <div className="text-sm text-slate-400">
              © 2025 Geographic Learning Platform. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PolandGeographyCourse;