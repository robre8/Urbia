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
    <div className="flex items-center gap-2">
      <Button
        type="button" // Explicitly set type to button to prevent form submission
        onClick={handleRecordClick}
        disabled={disabled}
        className={`rounded-full p-2 ${
          isRecording
            ? 'bg-red-500 hover:bg-red-600'
            : hasAudio
            ? 'bg-green-500 hover:bg-green-600'
            : 'bg-slate-200 hover:bg-slate-300'
        }`}
      >
        <LuMic className={`h-5 w-5 ${isRecording ? 'text-white' : ''}`} />
      </Button>
      {isRecording && <span>{recordingTime}s</span>}
      {hasAudio && !isRecording && <span>Audio grabado</span>}
    </div>
  );
}