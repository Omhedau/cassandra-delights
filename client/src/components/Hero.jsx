import React from 'react';

const Hero = () => {
    return (
        <section className="relative ">
           
            <div
                className="bg-cover rounded-lg bg-center mb-9 opacity-95 py-24 relative"
                style={{
                    backgroundImage: `url('../build/assets/breakfast.jpg')`,

                }}
            >
                <div className="container mx-auto text-center relative">
                    {/* Title */}
                    <div className='bg-green-300  caret-transparent  '>
                        <h1 className="text-4xl  caret-transparent   font-bold p-2 text-black shadow-xl shadow-gray-900">
                            Welcome to Cooking Delights
                        </h1>

                    </div>
<div className=' '>
<p className="text-2xl text-white shadow-xl   shadow-zinc-900">
                        Explore a world of delicious recipes that will tantalize your taste buds and inspire your culinary adventures.

                    </p>
</div>
                    {/* Description */}
                  

                </div>

            </div>

        </section>
    );
};

export default Hero;
