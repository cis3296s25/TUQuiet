import React from "react";



function Home() {
    return (
        <div className=" mt-20 hero min-h-screen">
        <div className="hero-content text-center">
          <div className="w-[80%]">
            
            <h1 className="text-7xl font-bold">Welcome to <span className="text-red-500">TU</span>Quiet</h1>
            <h2 className="py-10 pb-20 text-2xl">
            TUQuiet is designed to help you navigate campus more efficiently by giving you live data, student feedback, and a better understanding of the best places and times to study. Whether you're looking for the quietest study spots or need to know which buildings are busiest during your free time, TUQuiet keeps you informed and productive.
            </h2>
            <h1 className="text-4xl font-bold py-5 pb-10">Key Features of TUQuiet</h1>
            <h2 className="text-3xl font-bold">📍 Campus Navigation </h2> 
             <p className="py-7 pb-30 text-2xl">Easily find your way around Temple University campus with an interactive map, helping you get from point A to point B quickly and easily.</p>

             <h2 className="text-3xl font-bold">📊 Real-Time Traffic Data</h2> 
             <p className="py-7 pb-30 text-2xl">See which rooms and buildings are busiest at any given time based on live data uploaded by students just like you. Whether it's study halls or dining areas, TUQuiet gives you the inside scoop on campus traffic.</p>

             <h2 className="text-3xl font-bold">📝 Self-Reported Study Areas</h2> 
             <p className="py-7 pb-30 text-2xl">Share and discover study spots rated by fellow students. You can upload your own reviews on how quiet or loud the area is, and what the overall vibe is like for studying.</p>

             <h2 className="text-3xl font-bold">🔕 Optimized Study Times</h2> 
             <p className="py-7 pb-30 text-2xl">TUQuiet helps you pinpoint when specific rooms and buildings are the least crowded and most suitable for studying, based on real-time student inputs.</p>

            <button className="btn btn-primary">Shhhhhh....</button>
          </div>
        </div>
      </div>
    )
}

export default Home;
