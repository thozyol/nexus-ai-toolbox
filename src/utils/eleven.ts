export const ELEVEN_API_KEY_KEY = 'elevenlabs_api_key';

export const getElevenKey = () => localStorage.getItem(ELEVEN_API_KEY_KEY) || '';
export const saveElevenKey = (key: string) => localStorage.setItem(ELEVEN_API_KEY_KEY, key);

export const ELEVEN_VOICES: { id: string; name: string }[] = [
  { name: 'Aria', id: '9BWtsMINqrJLrRacOk9x' },
  { name: 'Roger', id: 'CwhRBWXzGAHq8TQ4Fs17' },
  { name: 'Sarah', id: 'EXAVITQu4vr4xnSDxMaL' },
  { name: 'Laura', id: 'FGY2WhTYpPnrIDTdsKH5' },
  { name: 'Charlie', id: 'IKne3meq5aSn9XLyUdCD' },
  { name: 'George', id: 'JBFqnCBsd6RMkjVDRZzb' },
  { name: 'Callum', id: 'N2lVS1w4EtoT3dr4eOWO' },
  { name: 'River', id: 'SAz9YHcvj6GT2YYXdXww' },
  { name: 'Liam', id: 'TX3LPaxmHKxFdv7VOQHJ' },
  { name: 'Charlotte', id: 'XB0fDUnXU5powFXDhCwa' },
  { name: 'Alice', id: 'Xb7hH8MSUJpSbSDYk0k2' },
  { name: 'Matilda', id: 'XrExE9yKIg1WjnnlVkGX' },
  { name: 'Will', id: 'bIHbv24MWmeRgasZH58o' },
  { name: 'Jessica', id: 'cgSgspJ2msm6clMCkdW9' },
  { name: 'Eric', id: 'cjVigY5qzO86Huf0OWal' },
  { name: 'Chris', id: 'iP95p4xoKVk53GoZ742B' },
  { name: 'Brian', id: 'nPczCjzI2devNBz1zQrb' },
  { name: 'Daniel', id: 'onwK4e9ZLuTAKqWW03F9' },
  { name: 'Lily', id: 'pFZP5JQG7iQjIQuC4Bku' },
  { name: 'Bill', id: 'pqHfZKP75CvOlQylNhV4' },
];
