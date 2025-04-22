
const NextSteps = () => {
  return (
    <div className="space-y-4">
      <p className="text-gray-600">What happens next?</p>
      
      <ul className="space-y-2 text-gray-600 text-left max-w-md mx-auto">
        <li className="flex items-start gap-2">
          <span className="mt-1 bg-peacefulBlue h-2 w-2 rounded-full flex-shrink-0"></span>
          <span>You will receive a confirmation email with details of your booking.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1 bg-peacefulBlue h-2 w-2 rounded-full flex-shrink-0"></span>
          <span>An hour before your appointment, you will receive connection details for your video consultation.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1 bg-peacefulBlue h-2 w-2 rounded-full flex-shrink-0"></span>
          <span>Please join 5 minutes before your scheduled time.</span>
        </li>
      </ul>
    </div>
  );
};

export default NextSteps;
