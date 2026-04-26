"""
Audio analysis engine.
Hybrid mode: uses sounddevice for real microphone input when available,
falls back to realistic demo simulation otherwise.
"""

import random
import math
import time


class AudioAnalyzer:
    """
    Captures audio from the system microphone and computes RMS dB level.
    Falls back to a smooth simulated signal when no microphone is available.
    """

    LOUD_THRESHOLD_DB = 72.0
    QUIET_THRESHOLD_DB = 28.0
    _demo_phase: float = 0.0

    def get_demo_db(self) -> float:
        """
        Generate a realistic-looking dB level using a sine wave base
        with random jitter — mimics real classroom audio dynamics.
        """
        self.__class__._demo_phase += 0.15
        base = 45 + 20 * math.sin(self._demo_phase)
        jitter = random.gauss(0, 6)
        # Occasionally spike to simulate events
        if random.random() < 0.08:
            jitter += random.uniform(20, 35)
        return round(max(10.0, min(95.0, base + jitter)), 2)

    def get_real_db(self) -> float:
        """
        Attempt to read from actual microphone using sounddevice.
        Returns demo value on failure.
        """
        try:
            import sounddevice as sd
            import numpy as np
            recording = sd.rec(int(0.5 * 44100), samplerate=44100, channels=1, dtype="float32")
            sd.wait()
            rms = float(np.sqrt(np.mean(recording ** 2)))
            if rms == 0:
                return self.get_demo_db()
            db = 20 * math.log10(rms + 1e-9) + 90  # Normalize to 0-100 range
            return round(max(10.0, min(95.0, db)), 2)
        except Exception:
            return self.get_demo_db()

    def capture_chunk(self, duration: float = 2.0):
        """
        Captures a chunk of audio from the microphone.
        Returns: (audio_bytes_wav, db_level) or (None, demo_db) if failed.
        """
        try:
            import sounddevice as sd
            import numpy as np
            import io
            import scipy.io.wavfile as wavfile
            
            sample_rate = 16000
            recording = sd.rec(int(duration * sample_rate), samplerate=sample_rate, channels=1, dtype="float32")
            sd.wait()
            
            rms = float(np.sqrt(np.mean(recording ** 2)))
            if rms == 0:
                return None, self.get_demo_db()
                
            db = 20 * math.log10(rms + 1e-9) + 90
            db_level = round(max(10.0, min(95.0, db)), 2)
            
            # Convert float32 [-1.0, 1.0] to int16 PCM for SpeechRecognition
            recording_int16 = np.int16(recording * 32767)
            wav_io = io.BytesIO()
            wavfile.write(wav_io, sample_rate, recording_int16)
            audio_bytes = wav_io.getvalue()
            
            return audio_bytes, db_level
            
        except Exception as e:
            print(f"Microphone capture error: {e}")
            return None, self.get_demo_db()

    def classify(self, db: float) -> str:
        if db > self.LOUD_THRESHOLD_DB:
            return "LOUD"
        if db < self.QUIET_THRESHOLD_DB:
            return "QUIET"
        return "NORMAL"
