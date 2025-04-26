
const NextSteps = () => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">What happens next?</h3>
      
      <ul className="space-y-3 text-gray-600 text-left max-w-md mx-auto">
        <li className="flex items-start gap-2">
          <span className="mt-1 bg-peacefulBlue h-2 w-2 rounded-full flex-shrink-0"></span>
          <span>Our team will contact you shortly via email and phone to confirm your consultation time.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1 bg-peacefulBlue h-2 w-2 rounded-full flex-shrink-0"></span>
          <span>Please keep an eye on your inbox and be available for a quick call if needed.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1 bg-peacefulBlue h-2 w-2 rounded-full flex-shrink-0"></span>
          <span>We're committed to making this process smooth and stress-free for you!</span>
        </li>
      </ul>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="font-medium mb-2">Need immediate assistance?</p>
        <p>Feel free to contact us at <a href="mailto:support@peace2hearts.com" className="text-peacefulBlue hover:underline">support@peace2hearts.com</a></p>
      </div>
    </div>
  );
};

export default NextSteps;
