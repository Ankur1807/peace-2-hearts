
import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import SocialMediaLogo from '../components/logo/SocialMediaLogo';
import { exportLogoForSocialMedia } from '../utils/imageExport';
import { Download, Image } from 'lucide-react';

const LogoExport = () => {
  const [profileCanvas, setProfileCanvas] = useState<HTMLCanvasElement | null>(null);
  const [coverCanvas, setCoverCanvas] = useState<HTMLCanvasElement | null>(null);
  const [previewType, setPreviewType] = useState<'profile' | 'cover'>('profile');
  
  // Handle canvas rendering
  const handleProfileRender = (canvas: HTMLCanvasElement) => {
    setProfileCanvas(canvas);
  };
  
  const handleCoverRender = (canvas: HTMLCanvasElement) => {
    setCoverCanvas(canvas);
  };
  
  // Handle export actions
  const handleExportProfile = () => {
    if (profileCanvas) {
      exportLogoForSocialMedia(profileCanvas, 'profile');
    }
  };
  
  const handleExportCover = () => {
    if (coverCanvas) {
      exportLogoForSocialMedia(coverCanvas, 'cover');
    }
  };
  
  return (
    <div className="container mx-auto py-12 px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-lora font-bold mb-4">Logo Export</h1>
        <p className="text-lg text-gray-600">
          Download the Peace2Hearts logo for social media use
        </p>
      </div>
      
      {/* Preview selector */}
      <div className="flex justify-center gap-4 mb-8">
        <Button
          variant={previewType === 'profile' ? 'default' : 'outline'}
          onClick={() => setPreviewType('profile')}
          className="min-w-32"
        >
          Profile Picture
        </Button>
        <Button
          variant={previewType === 'cover' ? 'default' : 'outline'}
          onClick={() => setPreviewType('cover')}
          className="min-w-32"
        >
          Cover Image
        </Button>
      </div>
      
      {/* Logo preview */}
      <div className="mb-12 flex justify-center">
        <div className="bg-gradient-to-br from-vibrantPurple to-vibrantPurple/80 rounded-lg p-6 shadow-lg relative">
          <div className="text-center mb-4">
            <h2 className="font-semibold text-xl text-white">
              {previewType === 'profile' ? 'Profile Picture Preview' : 'Cover Image Preview'}
            </h2>
            <p className="text-sm text-white/80">
              {previewType === 'profile' 
                ? '1200×1200 px - Square format for profile images'
                : '1500×500 px - Rectangle format for cover/banner images'}
            </p>
          </div>
          
          <div className={`relative overflow-hidden 
            ${previewType === 'profile' 
              ? 'w-full max-w-md aspect-square' 
              : 'w-full max-w-2xl aspect-[3/1]'
            } mx-auto border-2 border-white/20 rounded-lg`}>
            
            {/* Show appropriate preview */}
            {previewType === 'profile' ? (
              <img 
                src={profileCanvas?.toDataURL('image/jpeg') || ''} 
                alt="Profile Logo Preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <img 
                src={coverCanvas?.toDataURL('image/jpeg') || ''} 
                alt="Cover Logo Preview" 
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Overlay with dimensions */}
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              {previewType === 'profile' ? '1200×1200 px' : '1500×500 px'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Export options */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-lora text-xl mb-2 flex items-center gap-2">
            <Image className="h-5 w-5" />
            Profile Picture
          </h3>
          <p className="text-gray-600 mb-4">Square format (1:1) for profile images on social media platforms.</p>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">1200×1200 pixels</div>
            <Button onClick={handleExportProfile} disabled={!profileCanvas}>
              <Download className="mr-2 h-4 w-4" /> Download JPEG
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-lora text-xl mb-2 flex items-center gap-2">
            <Image className="h-5 w-5" />
            Cover Image
          </h3>
          <p className="text-gray-600 mb-4">Rectangle format (3:1) for cover images on social media platforms.</p>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">1500×500 pixels</div>
            <Button onClick={handleExportCover} disabled={!coverCanvas}>
              <Download className="mr-2 h-4 w-4" /> Download JPEG
            </Button>
          </div>
        </div>
      </div>
      
      {/* Hidden canvases used for rendering */}
      <div className="hidden">
        <SocialMediaLogo type="profile" onRender={handleProfileRender} />
        <SocialMediaLogo type="cover" onRender={handleCoverRender} />
      </div>
    </div>
  );
};

export default LogoExport;
