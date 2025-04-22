
interface PackageDetailsProps {
  packageName: string;
  timeframe: string;
}

const PackageDetails = ({ packageName, timeframe }: PackageDetailsProps) => {
  return (
    <>
      <p className="font-medium mb-2">Package Selected:</p>
      <p className="mb-4">{packageName}</p>
      <p className="font-medium mb-2">Preferred Timeframe:</p>
      <p>{timeframe}</p>
    </>
  );
};

export default PackageDetails;
