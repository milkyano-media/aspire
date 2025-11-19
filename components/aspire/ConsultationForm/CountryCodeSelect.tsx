interface CountryCodeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function CountryCodeSelect({ value, onChange }: CountryCodeSelectProps) {
  const countryCodes = [
    { code: '+61', flag: '🇦🇺', name: 'Australia' },
    { code: '+1-US', flag: '🇺🇸', name: 'USA' },
    { code: '+44', flag: '🇬🇧', name: 'UK' },
    { code: '+1-CA', flag: '🇨🇦', name: 'Canada' },
    { code: '+91', flag: '🇮🇳', name: 'India' },
    { code: '+65', flag: '🇸🇬', name: 'Singapore' },
    { code: '+64', flag: '🇳🇿', name: 'New Zealand' },
  ];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-gray-50 px-2 text-sm text-gray-700 focus:outline-none"
    >
      {countryCodes.map((country) => (
        <option key={country.code} value={country.code}>
          {country.flag} {country.code}
        </option>
      ))}
    </select>
  );
}
