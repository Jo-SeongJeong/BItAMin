import React, { useEffect, useState } from 'react';
import { fetchMissionsByDate } from '@/api/missionAPI';
import { getMemberPhraseByDate } from '@/api/phraseAPI';
import styles from '/src/styles/mission/MissionPage.module.css';
import recordOnly from '@/assets/missionImage/recordonly.png';
import missionDescriptionImg from '@/assets/missionImage/missionDescriptionImg.png';
import MissionModal from './MissionModal';

interface CompleteMissionProps {
  selectedDate: Date | null;
}

const CompleteMission: React.FC<CompleteMissionProps> = ({ selectedDate }) => {
  const [missionData, setMissionData] = useState<any>(null);
  const [phraseData, setPhraseData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchMissionAndPhraseData = async () => {
      if (selectedDate) {
        setLoading(true);
        setError(null);

        setMissionData(null);
        setPhraseData(null);

        try {
          const formattedDate = selectedDate.toISOString().split('T')[0];
          const todayDate = new Date().toISOString().split('T')[0];

          const missionResponse = await fetchMissionsByDate(formattedDate);
          if (missionResponse.success) {
            setMissionData(missionResponse.data);
          }

          if (formattedDate === todayDate && missionResponse.data) {
            const phraseResponse = await getMemberPhraseByDate(formattedDate);
            if (phraseResponse.success) {
              setPhraseData(phraseResponse.data);
            }
          } else if (formattedDate !== todayDate) {
            const phraseResponse = await getMemberPhraseByDate(formattedDate);
            if (phraseResponse.success) {
              setPhraseData(phraseResponse.data);
            }
          }
        } catch (err) {
          console.error('Error fetching data:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMissionAndPhraseData();
  }, [selectedDate]);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const isToday = selectedDate?.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];

  return (
    <div>
      {missionData && !phraseData && (
        <div>
          <div className={styles.missionContainer2}>
            <h3 className={styles.missionTitle}>
              <div className={styles.missionDate}>
                {selectedDate?.getDate()}일 미션
              </div>
              <div className={styles.missionName}>
                {missionData ? missionData.missionName : '미션 데이터가 없습니다.'}
                <button onClick={openModal} className={styles.modalButton}>
                  <img src={missionDescriptionImg} alt="정보 보기" style={{ width: '24px', height: '24px' , marginLeft: '15px'}} />
                </button>
              </div>
            </h3>
          </div>
          <div className={styles.missionContent}>
            <img src={missionData.imageUrl} alt="Mission" className={styles.missionImage} />
            <div className={styles.missionDetails}>
              <p>{missionData.missionReview}</p>
            </div>
          </div>
        </div>
      )}

      {missionData && phraseData && (
        <div>
          <div className={styles.missionContainer2}>
            <h3 className={styles.missionTitle}>
              <div className={styles.missionDate}>
                {selectedDate?.getDate()}일 미션
              </div>
              <div className={styles.missionName}>
                {missionData ? missionData.missionName : '미션 데이터가 없습니다.'}
                <button onClick={openModal} className={styles.modalButton}>
                  <img src={missionDescriptionImg} alt="정보 보기" style={{ width: '24px', height: '24px', marginLeft: '15px' }} />
                </button>
              </div>
            </h3>
          </div>
          <div className={styles.missionContent}>
            <img src={missionData.imageUrl} alt="Mission" className={styles.missionImage} />
            <div className={styles.missionDetails}>
              <p>{missionData.missionReview}</p>
            </div>
          </div>
          <div className={styles.phraseContainer}>
            <audio controls className={styles.audioPlayer}>
              <source src={phraseData.phraseUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
      )}

      {!missionData && phraseData && (
        // 녹음만 존재할 경우
        <div className={styles.missionContainer2}>
          {!isToday && (
            <div>
              <h3 className={styles.phraseTitle}>
                <div className={styles.phraseDate}>
                  {selectedDate?.getDate()}일 문구
                </div>
                <div className={styles.phraseContent}>
                  {phraseData ? phraseData.phraseContent : '녹음 데이터가 없습니다.'}
                </div>
              </h3>
              <div className={styles.onlyAudio}>
                <img src={recordOnly} alt="Mission" className={styles.onlyAudioImage} />
                <audio controls className={styles.onlyAudioPlayer}>
                  <source src={phraseData.phraseUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          )}
        </div>
      )}

      {selectedDate && (
        <MissionModal
          showModal={showModal}
          handleClose={closeModal}
          completeDate={selectedDate.toISOString().split('T')[0]} // 날짜 전달
        />
      )}
    </div>
  );
};

export default CompleteMission;
