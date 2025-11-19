import { cn } from '@/lib/utils';

interface RoleToggleProps {
  value: 'Student' | 'Parent';
  onChange: (value: 'Student' | 'Parent') => void;
}

export function RoleToggle({ value, onChange }: RoleToggleProps) {
  return (
    <div>
      <p className="mb-2 text-gray-700">Are you a student or a parent/guardian?</p>
      <div className="flex space-x-3">
        <button
          type="button"
          onClick={() => onChange('Student')}
          className={cn(
            'w-1/2 rounded-lg border py-2 font-medium transition-colors',
            value === 'Student'
              ? 'bg-[#002366] text-white'
              : 'border-gray-300 text-[#002366] hover:bg-gray-100'
          )}
        >
          Student
        </button>
        <button
          type="button"
          onClick={() => onChange('Parent')}
          className={cn(
            'w-1/2 rounded-lg border py-2 font-medium transition-colors',
            value === 'Parent'
              ? 'bg-[#002366] text-white'
              : 'border-gray-300 text-[#002366] hover:bg-gray-100'
          )}
        >
          Parent
        </button>
      </div>
    </div>
  );
}
