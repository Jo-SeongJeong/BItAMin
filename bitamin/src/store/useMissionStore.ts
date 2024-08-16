import create from 'zustand';
import { getMission, substituteMission } from '@/api/missionAPI';

interface MissionData {
  id: number;
  missionName: string;
  missionDescription: string;
  missionLevel: number;
}

interface MissionState {
  mission: MissionData | null;
  substituteCount: number;
  fetchMission: () => Promise<void>;
  handleSubstituteMission: () => Promise<void>;
}

export const useMissionStore = create<MissionState>((set) => ({
  mission: null,
  substituteCount: 0,

  fetchMission: async () => {
    const today = new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(/\. /g, '-').replace('.', '');
    const savedDate = localStorage.getItem('missionDate');

    if (savedDate !== today) {
      // 날짜가 변경되었으므로 로컬 스토리지 초기화
      localStorage.removeItem('missionDate');
      localStorage.removeItem('missionData');
      localStorage.removeItem('substituteCount');

      try {
        const response = await getMission();
        if (response.success) {
          // 새로운 데이터를 로컬 스토리지에 저장
          console.log("Saving date to localStorage:", today);
          localStorage.setItem('missionDate', today);

          localStorage.setItem('missionDate', today);
          localStorage.setItem('missionData', JSON.stringify(response.data));
          localStorage.setItem('substituteCount', '0');
          set({ mission: response.data, substituteCount: 0 });
        } else {
          console.error('미션을 가져오는데 실패했습니다:', response.message);
        }
      } catch (error) {
        console.error('미션을 가져오는 중 오류 발생:', error);
      }
    } else {
      const savedMission = localStorage.getItem('missionData');
      const savedSubstituteCount = localStorage.getItem('substituteCount');

      if (savedMission) {
        set({
          mission: JSON.parse(savedMission),
          substituteCount: savedSubstituteCount ? parseInt(savedSubstituteCount, 10) : 0,
        });
      }
    }
  },

  handleSubstituteMission: async () => {
    const { mission, substituteCount } = useMissionStore.getState();
    if (!mission || substituteCount >= 5) return;

    try {
      const response = await substituteMission(mission.id);
      if (response.success) {
        set((state) => ({
          mission: response.data,
          substituteCount: state.substituteCount + 1,
        }));

        localStorage.setItem('missionData', JSON.stringify(response.data));
        localStorage.setItem('substituteCount', (substituteCount + 1).toString());
      } else {
        console.error('미션 교체에 실패했습니다:', response.message);
      }
    } catch (error) {
      console.error('미션 교체 중 오류 발생:', error);
    }
  }
}));

