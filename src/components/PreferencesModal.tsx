
import { useState } from 'react';
import { UserPreferences } from '../types';
import { X } from 'lucide-react';

const availableTopics = ['Technology', 'Sports', 'Health', 'Business', 'Entertainment', 'Science'];
const availableSources = ['BBC', 'CNN', 'Al Jazeera', 'Reuters', 'The Guardian', 'New York Times'];

type PreferencesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onSave: (preferences: UserPreferences) => void;
  isUpdating: boolean;
};

export const PreferencesModal = ({ isOpen, onClose, preferences, onSave,isUpdating }: PreferencesModalProps) => {
  const [formData, setFormData] = useState(preferences);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>, field: keyof UserPreferences) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-xl font-semibold">News Preferences</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
            <select
              value={formData.topics}
              onChange={(e) => handleChange(e, 'topics')}
              className="w-full p-2 border rounded bg-gray-50"
            >
              <option value="">Select a Topic</option>
              {availableTopics.map((topic) => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
            <select
              value={formData.sources}
              onChange={(e) => handleChange(e, 'sources')}
              className="w-full p-2 border rounded bg-gray-50"
            >
              <option value="">Select a Source</option>
              {availableSources.map((source) => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={formData.language}
              onChange={(e) => handleChange(e, 'language')}
              className="w-full p-2 border rounded bg-gray-50"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
          
          <button
      type="submit"
      disabled={isUpdating}
      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
    >
      {isUpdating ? 'Saving...' : 'Save Preferences'}
    </button>
        </form>
      </div>
    </div>
  );
};