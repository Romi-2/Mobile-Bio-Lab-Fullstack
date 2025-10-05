import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAvailableSlots } from "../services/slotservice";
import "../style/SlotReservationPage.css";

interface Slot {
  id: number;
  city: string;
  date: string;
  start_time: string;
  end_time: string;
  available_seats: number;
}

interface CitySlot {
  city: string;
  totalSeats: number;
  slots: Slot[];
}

const SlotReservationPage: React.FC = () => {
  const navigate = useNavigate();
  const [citySlots, setCitySlots] = useState<CitySlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // Fetch slots from backend
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setLoading(true);
        const data = await getAvailableSlots();
        console.log("Fetched slots data:", data); // Debug log
        
        // Group slots by city
        const groupedSlots = groupSlotsByCity(data);
        setCitySlots(groupedSlots);
        console.log("Grouped city slots:", groupedSlots); // Debug log
      } catch (err) {
        console.error("Error fetching slots:", err);
        alert("Failed to load available slots");
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, []);

  // Group slots by city and calculate total available seats
  const groupSlotsByCity = (slots: Slot[]): CitySlot[] => {
    const cityMap = new Map<string, CitySlot>();
    
    slots.forEach(slot => {
      if (!cityMap.has(slot.city)) {
        cityMap.set(slot.city, {
          city: slot.city,
          totalSeats: 0,
          slots: []
        });
      }
      
      const citySlot = cityMap.get(slot.city)!;
      citySlot.slots.push(slot);
      citySlot.totalSeats += slot.available_seats;
    });
    
    return Array.from(cityMap.values()).filter(city => city.totalSeats > 0);
  };

  // Handle city selection
  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    
    // Get all slots for this city
    const citySlotData = citySlots.find(cs => cs.city === city);
    
    if (citySlotData && citySlotData.slots.length > 0) {
      // Navigate to ReservationPage with selected city data
      navigate("/reservation", { 
        state: { 
          selectedCity: city,
          citySlots: citySlotData.slots 
        } 
      });
    } else {
      alert("No available slots for this city");
    }
  };

  return (
    <div className="slot-reservation-page">
      <h2>Select Your City</h2>
      {loading && <p className="loading-text">Loading available cities...</p>}
      
      <div className="cities-container">
        {citySlots.length === 0 && !loading && (
          <p className="no-cities-message">No cities available for reservation!</p>
        )}
        
        {citySlots.map((citySlot) => (
          <div
            key={citySlot.city}
            className={`city-card ${selectedCity === citySlot.city ? "selected" : ""}`}
            onClick={() => handleCitySelect(citySlot.city)}
          >
            <div className="city-header">
              <h3 className="city-name">{citySlot.city}</h3>
              <div className="seat-badge">
                <span className="seat-count">{citySlot.totalSeats}</span>
                <span className="seat-text">seats available</span>
              </div>
            </div>
            
            <p className="city-description">
              Click to select available dates and time slots
            </p>

            <button
              className="select-button"
              onClick={(e) => {
                e.stopPropagation();
                handleCitySelect(citySlot.city);
              }}
              disabled={loading}
            >
              {loading ? "Loading..." : "Select City"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlotReservationPage;