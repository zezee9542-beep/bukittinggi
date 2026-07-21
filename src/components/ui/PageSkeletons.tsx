import { Skeleton } from './Skeleton';

export function GameMenuSkeleton() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-8 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="text-center mb-12 flex flex-col items-center">
        <Skeleton className="h-10 w-64 mb-4 rounded-xl" />
        <Skeleton className="h-5 w-full max-w-lg rounded-md" />
        <Skeleton className="h-5 w-3/4 max-w-md mt-2 rounded-md" />
      </div>

      {/* Grid Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative z-10 justify-items-center">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-[36px] shadow-lg overflow-hidden border border-gray-100 flex flex-col w-full max-w-[616px] h-[668px]">
            {/* Title / Description Area */}
            <div className="p-8 flex flex-col items-center text-center">
              <Skeleton className="h-8 w-3/4 mb-6 rounded-xl" />
              <Skeleton className="h-4 w-full mb-3" />
              <Skeleton className="h-4 w-5/6 mb-3" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            
            {/* Visual Area (Mocking GameCardPreviewStack) */}
            <div className="flex-1 bg-neutral-50 mx-4 sm:mx-8 mb-4 rounded-3xl p-6 flex items-center justify-center">
              <Skeleton className="w-48 h-64 rounded-[20px]" />
            </div>

            {/* Button Area */}
            <div className="p-6 sm:p-8 pt-0 flex justify-center">
              <Skeleton className="h-14 w-full max-w-[280px] rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MapSkeleton() {
  return (
    <div className="relative w-full h-[100dvh] flex flex-col overflow-hidden bg-neutral-50 animate-in fade-in duration-500">
      {/* Map Area */}
      <div className="flex-1 h-full w-full bg-neutral-100 relative">
        <Skeleton className="absolute inset-0 w-full h-full rounded-none opacity-50" />
      </div>
      
      {/* Sidebar Area (Desktop) */}
      <div className="hidden md:flex absolute top-0 left-0 flex-col w-full max-w-md h-full bg-white/90 backdrop-blur-sm shadow-xl z-20 border-r border-gray-100 p-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-4 p-4 rounded-xl border border-gray-100 shadow-sm bg-white">
              <Skeleton className="w-24 h-24 rounded-lg flex-shrink-0" />
              <div className="flex-1 flex flex-col justify-center">
                <Skeleton className="h-5 w-3/4 mb-3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BudayaSkeleton() {
  return (
    <div className="min-h-screen bg-[#E5D7D7] py-24 px-4 overflow-hidden animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Header */}
        <Skeleton className="h-6 w-32 mb-4 rounded-full" />
        <Skeleton className="h-12 w-72 mb-16 rounded-xl" />
        
        {/* Carousel Area */}
        <div className="w-full flex justify-center items-center gap-6">
          <Skeleton className="hidden md:block w-72 h-[450px] rounded-3xl opacity-50" />
          <Skeleton className="w-[320px] sm:w-[400px] h-[500px] rounded-3xl shadow-xl" />
          <Skeleton className="hidden md:block w-72 h-[450px] rounded-3xl opacity-50" />
        </div>

        {/* Text Details Area */}
        <div className="mt-12 text-center flex flex-col items-center w-full max-w-2xl">
          <Skeleton className="h-8 w-48 mb-6 rounded-xl" />
          <Skeleton className="h-5 w-full mb-3" />
          <Skeleton className="h-5 w-5/6 mb-8" />
          
          <div className="flex flex-col gap-4 w-full items-center">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function KulinerSkeleton() {
  return (
    <div className="min-h-screen bg-transparent pt-20 pb-16 px-4 animate-in fade-in duration-500">
      {/* Header */}
      <div className="w-full max-w-5xl mx-auto text-center mb-16 flex flex-col items-center">
        <Skeleton className="h-14 w-72 mx-auto mb-6 rounded-xl bg-white/50" />
        <Skeleton className="h-5 w-full max-w-2xl mx-auto mb-3 bg-white/50" />
        <Skeleton className="h-5 w-3/4 max-w-xl mx-auto bg-white/50" />
      </div>

      {/* Grid */}
      <div className="w-full max-w-7xl mx-auto flex flex-wrap justify-center gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex flex-col relative w-[304px] h-[408px] rounded-[36px] bg-white/60 shadow-md p-6 backdrop-blur-sm border border-white/40">
            <div className="flex-1 flex justify-center items-center">
              <Skeleton className="w-40 h-40 rounded-full" />
            </div>
            <div className="mt-6 flex flex-col items-center">
              <Skeleton className="h-8 w-3/4 mb-4 rounded-lg" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-2" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
