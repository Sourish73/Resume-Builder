import React, { useRef, useState, useEffect } from 'react';
import { DUMMY_RESUME_DATA, resumeTemplates } from '../utils/data';
import { TemplateCard } from './cards';
import { Check, X, ArrowLeft } from 'lucide-react';
import RenderResume from './RenderResume';

const TAB_DATA = [{ label: 'Templates' }];

// Tabs component
const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="flex gap-2">
      {tabs.map(tab => (
        <button
          key={tab.label}
          className={`px-6 py-3 text-lg font-semibold rounded-xl transition-all ${
            activeTab === tab.label 
              ? 'bg-violet-600 text-white shadow-lg' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab(tab.label)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

const ThemeSelector = ({ selectedTheme: initialTheme, setSelectedTheme, resumeData, onClose }) => {
    const resumeRef = useRef(null);
    const [baseWidth, setBaseWidth] = useState(1000);
    
    // Find initial index
    const findInitialIndex = () => {
      if (!initialTheme) return 0;
      let index = resumeTemplates.findIndex(t => t.id === initialTheme);
      if (index >= 0) return index;
      index = resumeTemplates.findIndex(t => t.id.toString() === initialTheme.toString());
      return index >= 0 ? index : 0;
    };
    
    const initialIndex = findInitialIndex();
    
    const [selectedTemplate, setSelectedTemplate] = useState({
        theme: resumeTemplates[initialIndex]?.id || resumeTemplates[0]?.id || "",
        index: initialIndex
    });   

    const [tabValue, setTabValue] = useState('Templates');

    const handleThemeSelection = () => {
        console.log("🎨 Applying theme:", selectedTemplate.theme);
        if (setSelectedTheme) {
            setSelectedTheme(selectedTemplate.theme);
        }
        if (onClose) {
            onClose();
        }
    };

    const updateBaseWidth = () => {
        if(resumeRef.current){
            // Use the full viewport width minus padding
            const viewportWidth = window.innerWidth - 100;
            setBaseWidth(Math.min(viewportWidth, 1200)); // Cap at 1200px
        }
    };

    useEffect(() => {
        updateBaseWidth();
        window.addEventListener("resize", updateBaseWidth);
        return () => {
            window.removeEventListener("resize", updateBaseWidth);
        };
    }, []);

    return (
        // FULL WIDTH CONTAINER - No max-width constraints
        <div className="w-screen max-w-none px-4 py-6 bg-white">
            {/* Header Section - Full width */}
            <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8 p-6 bg-gradient-to-r from-white to-violet-50 rounded-2xl border border-violet-100 shadow-sm mx-auto' style={{maxWidth: '1400px'}}>
                <div className="flex items-center gap-4">
                    {/* Return Button */}
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all text-sm"
                    >
                        <ArrowLeft size={16} />
                        Return
                    </button>
                    <Tabs tabs={TAB_DATA} activeTab={tabValue} setActiveTab={setTabValue} />
                </div>

                <div className="flex gap-4 items-center">
                    <button 
                      className='flex items-center justify-center gap-3 px-6 py-3 bg-gray-500 text-white font-bold rounded-2xl hover:bg-gray-600 transition-all shadow-lg'
                      onClick={onClose}
                    >
                      <X size={18} /> Cancel
                    </button>
                    <button 
                      className='flex items-center justify-center gap-3 px-8 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold rounded-2xl hover:scale-105 transition-all shadow-lg hover:shadow-xl' 
                      onClick={handleThemeSelection}
                    >
                      <Check size={20} /> Apply Theme
                    </button>
                </div>
            </div>
             
            {/* Main Content - Full width grid */}
            <div className='grid grid-cols-1 xl:grid-cols-12 gap-8 mx-auto' style={{maxWidth: '1400px'}}>
                {/* Templates Sidebar - 4 columns */}
                <div className='xl:col-span-4 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm'>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-800">Choose a Template</h3>
                        {/* Apply Button in Sidebar */}
                        <button 
                            className='flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-md'
                            onClick={handleThemeSelection}
                        >
                            <Check size={16} /> Apply
                        </button>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6 max-h-[75vh] overflow-y-auto p-4'>
                        {resumeTemplates.map((template, index) => (
                            <div key={`templates_${index}`} className="transform hover:scale-105 transition-transform duration-200">
                                <TemplateCard 
                                    thumbnailImg={template.thumbnailImg} 
                                    isSelected={selectedTemplate.index === index}
                                    onSelect={() => {
                                        setSelectedTemplate({
                                            theme: template.id,
                                            index: index
                                        });
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Preview Area - 8 columns */}
                <div className='xl:col-span-8 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm' ref={resumeRef}>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-800">Live Preview</h3>
                        <div className="flex items-center gap-4">
                            <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-800 font-medium">
                                    Current: <span className="font-bold">Theme {selectedTemplate.theme}</span>
                                </p>
                            </div>
                            {/* Another Apply Button in Preview Header */}
                            <button 
                                className='flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-md'
                                onClick={handleThemeSelection}
                            >
                                <Check size={16} /> Apply This Template
                            </button>
                        </div>
                    </div>
                    
                    {/* Preview Container - Large and centered */}
                    <div className="w-full bg-gray-50 rounded-xl p-8 border-2 border-dashed border-gray-300 min-h-[800px] flex items-center justify-center">
                        <div className="w-full max-w-4xl mx-auto">
                            <RenderResume 
                                templateId={selectedTemplate?.theme || ""}
                                resumeData={resumeData || DUMMY_RESUME_DATA}
                                containerWidth={baseWidth} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThemeSelector;