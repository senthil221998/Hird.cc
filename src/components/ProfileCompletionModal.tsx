import { AlertCircle } from 'lucide-react';

interface ProfileCompletionModalProps {
  onComplete: () => void;
}

export const ProfileCompletionModal = ({ onComplete }: ProfileCompletionModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Complete Your Profile
            </h3>
            <p className="text-gray-600 mb-6">
              Before you can start using the app, please complete your profile with the required information. This will help us generate better resumes for you.
            </p>
            <button
              onClick={onComplete}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Complete Profile Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
