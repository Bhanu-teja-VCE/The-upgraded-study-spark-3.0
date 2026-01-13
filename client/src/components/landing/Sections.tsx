
export function Pricing() {
    return (
        <section id="pricing" className="py-24 relative border-t border-white/5">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl font-black mb-8">Access the Network</h2>
                <div className="inline-block p-1 rounded-2xl bg-white/5 border border-white/10">
                    <div className="px-8 py-12 rounded-xl bg-[#12121A]">
                        <span className="text-[#00D9FF] font-bold tracking-widest uppercase text-sm">Early Access</span>
                        <div className="text-5xl font-black mt-4 mb-2 text-white">Free</div>
                        <p className="text-gray-500 mb-8">During Beta Protocol</p>
                        <button className="w-full bg-[#00D9FF] text-black font-bold py-3 rounded-lg hover:opacity-90">Join Waitlist</button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export function Showcase() {
    return (
        <section id="showcase" className="py-24 bg-[#050507]">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-8 text-gray-500 uppercase tracking-widest">Interface Preview</h2>
                <div className="max-w-4xl mx-auto aspect-video bg-[#12121A] rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-Tr from-[#00D9FF]/10 to-transparent opacity-50" />
                    <p className="text-gray-500 z-10">Dashboard Visualization</p>
                    {/* If user has screenshot, can add here later */}
                </div>
            </div>
        </section>
    )
}
