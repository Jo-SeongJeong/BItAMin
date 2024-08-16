const HeaderComponent = ({
  isPrivate,
  title,
  count,
  maxCount,
  handleTransferClick,
  handleSummaryClick,
  category, // 카테고리 추가
}) => {
  // 카테고리에 따라 maxCount 변경
  const adjustedMaxCount = category === '미술' ? 6 : maxCount

  return (
    <div className="flex justify-between items-center p-3 bg-blue-100 text-gray-800 shadow-md">
      <div className="flex items-center">
        {isPrivate ? (
          <span className="text-red-500 mr-2 text-xl">🔒</span>
        ) : (
          <span className="text-green-500 mr-2 text-xl">🔓</span>
        )}
        <span className="text-lg font-bold">{title}</span>
      </div>
      <div className="flex">
        <button
          onClick={handleTransferClick}
          disabled={count >= adjustedMaxCount} // 카테고리에 따른 maxCount를 기준으로 비활성화 조건 적용
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          다음 이야기
        </button>
        <button
          onClick={handleSummaryClick}
          disabled={count < adjustedMaxCount} // count가 adjustedMaxCount보다 작을 때 비활성화
          className="ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
        >
          요약
        </button>
      </div>
    </div>
  )
}

export default HeaderComponent
