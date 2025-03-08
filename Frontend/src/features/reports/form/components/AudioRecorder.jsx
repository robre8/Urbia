import { Button } from '@/components/ui/button';
import { LuMic } from 'react-icons/lu';

export function AudioRecorder({ isRecording, recordingTime, onStart, onStop, hasAudio, disabled }) {
  const handleRecordClick = (e) => {
    // Prevent the event from bubbling up to the form
    e.preventDefault();
    e.stopPropagation();
    
    if (isRecording) {
      onStop();
    } else {
      onStart();
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        onClick={handleRecordClick}
        disabled={disabled}
        className={`rounded-full p-1 h-7 w-7 flex items-center justify-center ${
          isRecording
            ? 'bg-red-500 hover:bg-red-600'
            : hasAudio
            ? 'bg-green-500 hover:bg-green-600'
            : 'bg-lime-300 hover:bg-lime-400'
        }`}
      >
        <LuMic className={`h-4 w-4 ${isRecording ? 'text-white' : 'text-black'}`} />
      </Button>
      {isRecording && <span className="text-xs">{recordingTime}s</span>}
      {hasAudio && !isRecording && <span className="text-xs">Audio grabado</span>}
    </div>
  );
}