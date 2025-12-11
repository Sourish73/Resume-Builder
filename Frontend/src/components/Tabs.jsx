import React from 'react'

export const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className='w-full my-2'>
        <div className='flex flex-wrap bg-violet-100 p-1 rounded-2xl border border-violet-200'>
          {tabs.map((tab) => (
            <button 
              key={tab.label} 
              className={`relative flex-1 min-w-[120px] px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200 ${
                activeTab === tab.label 
                  ? 'bg-white text-violet-700 shadow-lg' 
                  : 'text-slate-500 hover:text-violet-600 hover:bg-white/50'
              }`}
              onClick={() => setActiveTab(tab.label)}
            >
              <span className="relative z-10 block">
                {tab.label}
              </span>
              {activeTab === tab.label && (
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-xl" />
              )}
            </button>
          ))}
        </div>
    </div>
  )
}