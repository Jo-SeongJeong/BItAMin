import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';
import { format } from 'date-fns';
import ko from 'date-fns/locale/ko';
import styles from '/src/styles/mission/quest2.module.css';
import 'react-datepicker/dist/react-datepicker.css';
import '/src/styles/mission/custom-datepicker.css';
import { fetchMonthMissionAndPhrase, fetchMissionsByDate } from '@/api/missionAPI';

// @ts-ignore
registerLocale('ko', ko);
setDefaultLocale('ko');

interface CalendarProps {
  onDateChange: (date: Date | null) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [loading, setLoading] = useState<boolean>(false);
  const [monthMissions, setMonthMissions] = useState<any[]>([]);

  const fetchMissionDate = async (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    try {
      setLoading(true);
      const data = await fetchMissionsByDate(formattedDate);
      const missionDate = new Date(data.completeDate);

      const response = await fetchMonthMissionAndPhrase(formattedDate);
      const monthData = response.data;
      setMonthMissions(Array.isArray(monthData) ? monthData : []);

      setSelectedDate(date);
    } catch (error) {
      console.error('Error fetching mission date:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const today = new Date();
    fetchMissionDate(today);
    onDateChange(today);
    return () => {
      setLoading(false);
    };
  }, []);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const correctedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      setSelectedDate(correctedDate);
      onDateChange(correctedDate);
      fetchMissionDate(correctedDate);
    }
  };
  const findEarliestMissionDate = (missions: any[]) => {
    const completedMissions = missions.filter(mission => mission.memberMissionId);

    if (completedMissions.length > 0) {
      // complete한 미션이 있는 가장 빠른 날짜를 찾음
      const earliestMissionDate = completedMissions.reduce((earliest, mission) => {
        const missionDate = new Date(mission.activityDate);
        return missionDate < earliest ? missionDate : earliest;
      }, new Date(completedMissions[0].activityDate));

      return earliestMissionDate;
    } else {
      // complete한 미션이 없다면 1일로 설정
      return null;
    }
  };

  const handleMonthChange = async (date: Date) => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);

    try {
      setLoading(true);
      const response = await fetchMonthMissionAndPhrase(format(firstDayOfMonth, 'yyyy-MM-dd'));
      const monthData = response.data;
      setMonthMissions(Array.isArray(monthData) ? monthData : []);

      const earliestMissionDate = findEarliestMissionDate(monthData) || firstDayOfMonth;

      setSelectedDate(earliestMissionDate);
      onDateChange(earliestMissionDate);
    } catch (error) {
      console.error('Error fetching month missions:', error);
    } finally {
      setLoading(false);
    }
  };


  const renderCustomHeader = ({
                                date,
                                decreaseMonth,
                                increaseMonth,
                              }: {
    date: Date;
    decreaseMonth: () => void;
    increaseMonth: () => void;
  }) => (
    <div className={styles.header}>
      <button
        className={styles.prevButton}
        onClick={() => {
          decreaseMonth();
          handleMonthChange(new Date(date.getFullYear(), date.getMonth() - 1));
        }}
      >
        {'<'}
      </button>
      <span className={styles.currentMonth}>{format(date, 'yyyy.MM')}</span>
      <button
        className={styles.nextButton}
        onClick={() => {
          increaseMonth();
          handleMonthChange(new Date(date.getFullYear(), date.getMonth() + 1));
        }}
      >
        {'>'}
      </button>
    </div>
  );

  const getDayClassName = (date: Date) => {
    let classNames = '';

    const today = new Date();
    today.setHours(0, 0, 0, 0); // 오늘 날짜의 시간을 00:00:00으로 설정
    date.setHours(0, 0, 0, 0); // 입력받은 날짜의 시간을 00:00:00으로 설정

    const isToday = date.getTime() === today.getTime();

    const hasMission = monthMissions.some(mission =>
      new Date(mission.activityDate).toDateString() === date.toDateString() && mission.memberMissionId
    );
    const hasPhrase = monthMissions.some(mission =>
      new Date(mission.activityDate).toDateString() === date.toDateString() && mission.memberPhraseId
    );

    // 오늘 날짜에 대해서도 CSS 클래스를 적용
    if (isToday) {
      if (hasMission && !hasPhrase) {
        classNames += ' react-datepicker__day--mission';
      }
      if (hasPhrase && !hasMission) {
        classNames += ' react-datepicker__day--phrase';
      }
      if (hasPhrase && hasMission) {
        classNames += ' react-datepicker__day--phrase--mission';
      }
    } else {
      if (hasMission && !hasPhrase) {
        classNames += ' react-datepicker__day--mission';
      }
      if (hasPhrase && !hasMission) {
        classNames += ' react-datepicker__day--phrase';
      }
      if (hasPhrase && hasMission) {
        classNames += ' react-datepicker__day--phrase--mission';
      }

      if (!hasMission && !hasPhrase) {
        classNames += ' react-datepicker__day--disabled';
      }
    }

    return classNames.trim();
  };



  const getWeekDayClassName = (date: Date) => {
    const day = date.getDay();
    if (day === 0) {
      return styles.sunday;
    } else if (day === 6) {
      return styles.saturday;
    }
    return '';
  };

  return (
    <div className={styles.calendarContainer} style={{ zIndex: 1000 }}>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        inline
        locale="ko"
        maxDate={new Date()}
        renderCustomHeader={renderCustomHeader}
        calendarClassName={styles.customCalendar}
        dayClassName={getDayClassName}
        formatWeekDay={(day) => day.substr(0, 1)}
        weekDayClassName={getWeekDayClassName}
      />
      {loading && <p>로딩 중...</p>}
      <div>
      </div>
    </div>
  );
};

export default Calendar;
