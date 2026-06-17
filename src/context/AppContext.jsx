import React, { createContext, useState, useEffect } from 'react';
import { analyzeSkinTone } from '../utils/colorTheory';
import { LUXURY_ESSENTIALS } from '../utils/mockData';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Navigation & Onboarding States
  const [isOnboarded, setIsOnboarded] = useState(() => {
    return localStorage.getItem('waardly_onboarded') === 'true';
  });

  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem('waardly_onboarded') === 'true' ? 'home' : 'onboarding';
  });

  // User Profile
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('waardly_profile');
    return saved ? JSON.parse(saved) : {
      name: '',
      gender: 'Female', // Default, can be Female, Male, Unisex
      bodyShape: 'Hourglass',
      styleGoal: 'Effortless Chic',
      referencePhoto: null, // Base64 or object URL string
      skinToneHex: '#EAE7E1', // Default sand tone before sampling
      undertone: null,
      season: null,
      colorPalette: [],
      colorJustification: ''
    };
  });

  // Wardrobe Database (Starts empty as a clean slate)
  const [wardrobe, setWardrobe] = useState(() => {
    const saved = localStorage.getItem('waardly_wardrobe');
    return saved ? JSON.parse(saved) : [];
  });

  // Daily tracker logs
  const [dailyLogs, setDailyLogs] = useState(() => {
    const saved = localStorage.getItem('waardly_daily_logs');
    return saved ? JSON.parse(saved) : [];
  });

  // Premium Status
  const [isPremium, setIsPremium] = useState(() => {
    return localStorage.getItem('waardly_premium') === 'true';
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('waardly_onboarded', isOnboarded.toString());
  }, [isOnboarded]);

  useEffect(() => {
    localStorage.setItem('waardly_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('waardly_wardrobe', JSON.stringify(wardrobe));
  }, [wardrobe]);

  useEffect(() => {
    localStorage.setItem('waardly_daily_logs', JSON.stringify(dailyLogs));
  }, [dailyLogs]);

  useEffect(() => {
    localStorage.setItem('waardly_premium', isPremium.toString());
  }, [isPremium]);

  // Complete onboarding
  const completeOnboarding = (profileData, photoUrl) => {
    // Perform initial skin-tone analysis from a default sample color (or let user pick)
    // If no skin tone hex is in profileData, we use a default neutral light beige '#EAD4C3'
    const hex = profileData.skinToneHex || '#EAD4C3';
    const analysis = analyzeSkinTone(hex);

    const updatedProfile = {
      ...userProfile,
      ...profileData,
      referencePhoto: photoUrl,
      skinToneHex: hex,
      undertone: analysis.undertone,
      season: analysis.season,
      colorPalette: analysis.palette,
      colorJustification: analysis.justification
    };

    setUserProfile(updatedProfile);
    setIsOnboarded(true);
    setCurrentView('home');
  };

  // Dynamically update skin tone (used by the Eyedropper Color Picker)
  const updateSkinTone = (hexColor) => {
    const analysis = analyzeSkinTone(hexColor);
    setUserProfile(prev => ({
      ...prev,
      skinToneHex: hexColor,
      undertone: analysis.undertone,
      season: analysis.season,
      colorPalette: analysis.palette,
      colorJustification: analysis.justification
    }));
  };

  // Add item to wardrobe
  const addWardrobeItem = (item) => {
    const newItem = {
      id: `item_${Date.now()}`,
      ...item
    };
    setWardrobe(prev => [newItem, ...prev]);
    return newItem;
  };

  // Remove item from wardrobe
  const removeWardrobeItem = (itemId) => {
    setWardrobe(prev => prev.filter(item => item.id !== itemId));
  };

  // Prepopulate wardrobe with luxury essentials (Convenience feature for reviews)
  const importLuxuryEssentials = () => {
    // Prevent duplicates by checking ids
    setWardrobe(prev => {
      const existingIds = new Set(prev.map(item => item.id));
      const filteredEssentials = LUXURY_ESSENTIALS.filter(item => !existingIds.has(item.id));
      return [...prev, ...filteredEssentials];
    });
  };

  // Clear all wardrobe data (reset to clean slate)
  const clearWardrobe = () => {
    setWardrobe([]);
  };

  // Log daily wear
  const logDailyWear = (itemIds, photo = null) => {
    const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
    const newLog = {
      id: `log_${Date.now()}`,
      date: today,
      itemIds,
      photo
    };

    // Remove any existing log for today to prevent duplicates, then add new log
    setDailyLogs(prev => [newLog, ...prev.filter(log => log.date !== today)]);
  };

  // Clear profile data (Logout/Reset app)
  const resetApp = () => {
    setIsOnboarded(false);
    setCurrentView('onboarding');
    setUserProfile({
      name: '',
      gender: 'Female',
      bodyShape: 'Hourglass',
      styleGoal: 'Effortless Chic',
      referencePhoto: null,
      skinToneHex: '#EAE7E1',
      undertone: null,
      season: null,
      colorPalette: [],
      colorJustification: ''
    });
    setWardrobe([]);
    setDailyLogs([]);
    setIsPremium(false);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        isOnboarded,
        currentView,
        setCurrentView,
        userProfile,
        setUserProfile,
        wardrobe,
        setWardrobe,
        dailyLogs,
        isPremium,
        setIsPremium,
        completeOnboarding,
        updateSkinTone,
        addWardrobeItem,
        removeWardrobeItem,
        importLuxuryEssentials,
        clearWardrobe,
        logDailyWear,
        resetApp
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
