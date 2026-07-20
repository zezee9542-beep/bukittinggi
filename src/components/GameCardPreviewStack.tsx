import cardImg from '../assets/card.png';

export function GameCardPreviewStack({ imageSrc }: { imageSrc?: string }) {
  return (
    <div
      className="relative rounded-[20px] sm:rounded-[24px] overflow-hidden mb-4 sm:mb-6 flex-shrink-0 mx-auto h-[180px] sm:h-[330px] w-full"
      style={{
        maxWidth: '538px',
        boxShadow: 'inset 0 4px 12px rgba(68, 70, 81, 0.4), 0 8px 24px rgba(68, 70, 81, 0.15)',
      }}
    >
      <img
        src={imageSrc || cardImg}
        alt="Game Card Preview"
        className="w-full h-full"
        style={{ objectFit: 'cover', objectPosition: 'center', transform: 'scale(1.35)' }}
      />
      {/* Inner shadow overlay */}
      <div
        className="absolute inset-0 rounded-[20px] sm:rounded-[24px] pointer-events-none"
        style={{
          boxShadow: 'inset 0 8px 20px rgba(68, 70, 81, 0.4)',
        }}
      />
    </div>
  );
}
