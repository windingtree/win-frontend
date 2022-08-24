import MainLayout from 'src/layouts/main';
import { Box, Typography, Link } from '@mui/material';

const ContactEmailLink = () => {
  return (
    <Link href='mailto:hi@windingtree.com' target='_blank'>hi@windingtree.com</Link>
  )
}

const ExternallUnsafeLink = ({href}) => {
  return (
    <Link
      href={href}
      target='_blank'
      rel='noopener noreferer'
    >
      {href}
    </Link>
  )
}

export const Privacy = () => {
  return (
    <MainLayout>
      <Box sx={{ width: '100%', maxWidth: 600 }} alignSelf='center'>
      <Typography variant='h3' gutterBottom>
      Privacy and Cookie Policy
      </Typography>
      <Typography variant='caption'>
      Effective Date: August 24, 2022
      </Typography>
      <Typography variant='body1' gutterBottom>
      Your privacy and trust are important to us. This Privacy and Cookie Policy explains the way Winding Tree
      Limited, having its corporate seat in Gibraltar and its affiliates (jointly, “Winding Tree” or “we” or “us”) collect,
      process and protect your personal data. We are committed to protecting your personal data in accordance with
      applicable privacy law and regulations.
      </Typography>
      <Typography variant='body1' gutterBottom>
      Continuous technological development, changes to our services, changes to laws and regulations, or other reasons
      may require us to amend our Privacy and Cookie Policy. We will make changes to this Privacy and Cookie Policy
      regularly and we ask that you keep yourself informed of its contents.
      </Typography>
      <Typography variant='body1' gutterBottom>
      The English-language version of this Privacy Policy shall be controlling in all respects and shall prevail in case of
      any inconsistencies with translated versions Winding Tree may provide, if any.
      </Typography>
      <Typography variant='h5' gutterBottom>
      1. The personal information we collect
      </Typography>
      <Typography variant='body1' gutterBottom>
      1.1. Personal information is typically data that identifies an individual or relates to an identifiable individual.
      This includes information you provide to us and information which is collected about you automatically.
      The definition of personal information depends on the applicable law based on your physical location. Only
      the definition that applies to your physical location will apply to you under this Privacy and Cookie Policy.
      We may combine information automatically collected with other information that we have collected about
      you.
      </Typography>
      <Typography variant='body1' gutterBottom>
      1.2. You may browse and use certain portions of our website without directly providing us with any personal
      data. Notwithstanding, certain features may only be used by users that provide us with personal
      information.
      </Typography>
      <Typography variant='body1' gutterBottom>
        A. <b>Information we collect from you (or someone acting for you).</b> To access our Services, we will ask
        you to provide us with some important information about yourself. This information is either
        required by law, necessary to provide the Services, or is relevant for certain specified purposes. If
        you choose not to share certain information with us, we may not be able to serve you as effectively
        or offer you our Services. We may collect the following types of information from you:
        <ul>
          <li>contact details, including your name, surname and email address;</li>
          <li>personal details such as age, date of birth;</li>
          <li>information about your reservation;</li>
          <li>information you provide to us through customer surveys or feedback; and</li>
          <li>newsletter you signed up for.</li>
        </ul>
      </Typography>
      <Typography variant='body1' gutterBottom>
      B. <b>Information we collect automatically.</b> To the extent permitted under the applicable law, we
      automatically collect information through your use of our website using cookies and other
      technologies. This information helps us improve the performance of our website and Services,
      provide you with a streamlined and personalized experience, and protect your account from fraud by
      detecting unauthorized access. This information includes your:
      <ul>
        <li>domain name, operating system, settings and system configurations;</li>
        <li>IP address;</li>
        <li>the webpage you access within our website;</li>
        <li>the website that led you to our website;</li>
        <li>the website to which you go after leaving our website;</li>
        <li>the dates and times you access our website; and</li>
        <li>web log personal information.</li>
      </ul>
      </Typography>
      <Typography variant='h5' gutterBottom>
      2. How your personal information is used
      </Typography>
      <Typography variant='body1' gutterBottom>
      2.1. We ask for personal information to help you organise your online trip bookings and ensure you get the best
      service possible. We generally use personal information to create, develop, operate, deliver, and improve
      our Services. We may use this information in the following ways:
      <ul>
      <li><b>Trip Bookings:</b> We use your personal data to complete and administer your online trip booking. This
      includes sending confirmations, modifications and reminders.</li>
      <li><b>Marketing:</b> Where you consent, we will provide you with news and information about our Services we
      think may interest you, and for other marketing, advertising, and promotional purposes, provided that
      you have not opted-out of receiving such communications.</li>
      <li><b>Market research:</b> We sometimes invite you to take part in market research. Please see the information
      that accompanies this kind of invitation to understand how the personal data is used.</li>
      <li><b>Improving our services:</b> We also can use your personal data for analytical purposes and product
      improvement. Part of our commitment is to make our services better and enhancing the user experience.</li>
      <li><b>Customer reviews and other destination-related information:</b> During and after your trip, we might
      invite you to submit a review.</li>
      <li><b>Legal obligations:</b> In some instances, legal regulations impose obligations on us under which we are
      obliged to process personal data. The legal ground for processing of such data is compliance with legal
      obligations.</li>
      </ul>
      </Typography>
      <Typography variant='body1' gutterBottom>
      2.2. For purposes of European Union law and similar data protection regimes, we generally act as a data
      controller, meaning we determine the purposes and means of processing your personal information. Our
      travel partners to whom we may connect you to make reservations are also data controllers. To learn more
      about how a travel partner may use your personal information, you should review its privacy notice.
      </Typography>
      <Typography variant='h5' gutterBottom>
      3.- How we store your personal data
      </Typography>
      <Typography variant='body1' gutterBottom>
      3.1. Winding Tree maintains commercially-reasonable technical, administrative, and physical security measures
      designed to protect your information from loss, misuse, unauthorized access, disclosure, alteration, and
      destruction.
      </Typography>
      <Typography variant='body1' gutterBottom>
      3.2. We use appropriate business systems and procedures to protect and safeguard the personal data you give us.
      We also use security procedures and technical and physical restrictions for accessing and using the personal
      data on our servers. Only authorised personnel are permitted to access personal data in the course of their
      work.
      </Typography>
      <Typography variant='body1' gutterBottom>
      3.3. We will keep your personal data for as long as is necessary to enable you to use our services or to provide
      our services to you, to comply with applicable laws, resolve any disputes and otherwise to allow us to
      conduct our Services, including to detect and prevent fraud and/or other illegal activities. Once this time
      period has expired, we will delete your personal information.
      </Typography>
      <Typography variant='h5' gutterBottom>
      4.- How we disclose your information
      </Typography>
      <Typography variant='body1' gutterBottom>
      4.1. We will only disclose your information, including personal information, to third parties for the purposes of
      completing your travel booking through us, in order to provide you with the information or services you
      have requested, or with your explicit consent.
      </Typography>
      <Typography variant='body1' gutterBottom>
      4.2. We reserve the right to disclose your information, including personal information, to certain permitted third
      parties including members of our own group, trusted partners some of whom are located outside the
      European Economic Area and our professional advisers.
      </Typography>
      <Typography variant='body1' gutterBottom>
      4.3. We may disclose your information, including personal information, where we believe it is necessary to
      investigate, prevent, or take action regarding illegal activities, suspected fraud, situations involving
      potential threats to the safety of any person, violations of our Terms and Conditions or this Privacy and
      Cookie Policy, or as evidence in litigation in which we are involved.
      </Typography>
      <Typography variant='h5' gutterBottom>
      5.- Newsletter
      </Typography>
      <Typography variant='body1' gutterBottom>
      5.1. General information
      </Typography>
      <Typography variant='body1' gutterBottom>
      In accordance with Article 6(1)(a) General Data Protection Regulation (EU) 2016/679 (“GDPR”), you can
      subscribe our newsletter which will inform you about our services. To sign up for our newsletter, we use the
      “double opt-in” method. Consequently, after you have signed up, we will send you an e-mail to the e-mail address
      specified, in which we ask you to conform that you wish to receive the newsletter. In the event that you do not
      confirm your sign-up within 24 hours, your information will be locked and automatically deleted after one month.
      </Typography>
      <Typography variant='body1' gutterBottom>
      In addition, we save the IP addresses you used and the times of sign-up and confirmation. The purpose of this
      procedure is to verify your sign-up and, if necessary, to inform you about possible misuse of your personal
      information.
      </Typography>
      <Typography variant='body1' gutterBottom>
      For sending the newsletter the only requirement is your email address. After your confirmation, we will save your
      e-mail address for the purpose of sending you the newsletter.
      You may revoke your consent to receiving the newsletter at any time by clicking the link provided in each
      newsletter e-mail or by contacting our data protection officer.
      </Typography>
      <Typography variant='body1' gutterBottom>
      5.2. Newsletter tracking
      </Typography>
      <Typography variant='body1' gutterBottom>
      We use web beacons, tracking pixels and other technologies to track and analyse your interactions with the
      newsletter. This data is allocated to your e-mail address and pseudonymized ID. We use this data to generate a
      user profile to personalise the newsletter for you.
      </Typography>
      <Typography variant='body1' gutterBottom>
      You can object to this at any time by using the unsubscribe link provided in each e-mail or by contacting our data
      protection officer.
      </Typography>
      <Typography variant='body1' gutterBottom>
      Newsletter tracking is not possible if you&#39;ve deactivated image viewing by default in your e-mail application. In
      this case, the newsletter will not be displayed in full and you will not be able to use all the features. If you display
      images manually, tracking will occur.
      </Typography>
      <Typography variant='h5' gutterBottom>
      6.- Cookies and other tracking mechanisms
      </Typography>
      <Typography variant='body1' gutterBottom>
      We use cookies to help provide, protect and improve your experience of our website. This cookie policy is part of
      Winding Tree Limited&#39;s privacy policy. It covers the use of cookies between your device and our site.
      </Typography>
      <Typography variant='body1' gutterBottom>
      We also provide basic information on third-party services we may use, who may also use cookies as part of their
      service. This policy does not cover their cookies.
      </Typography>
      <Typography variant='body1' gutterBottom>
      In the event that you choose to decline cookies, some parts of the Platform may not work as intended or may not
      work at all.
      </Typography>
      <Typography variant='body1' gutterBottom>
      6.1. What are cookies?
      </Typography>
      <Typography variant='body1' gutterBottom>
      A cookie is a small piece of data (text file) that a website stores on your computer or mobile device when you visit
      the site. They are widely used to remember you and your preferences, either for a single visit -through a “session
      cookie”- or for multiple repeat visits -using a “persistent cookie”.
      </Typography>
      <Typography variant='body1' gutterBottom>
      Persistent cookies saved on your computer and that are not deleted automatically when you quit your browser,
      unlike a session cookie, which is deleted when you quit your browser.
      </Typography>
      <Typography variant='body1' gutterBottom>
      Every time you visit our website, you will be prompted to accept or refuse cookies.
      </Typography>
      <Typography variant='body1' gutterBottom>
      6.2.- Types of cookies and how we use them
      </Typography>
      <Typography variant='body1' gutterBottom>
      6.2.1. Essential cookies are used to operate the core functions of our website, so that you may visit and move
      around it, and use its features. We do not require your consent to use these cookies.
      </Typography>
      <Typography variant='body1' gutterBottom>
      At the present, we do not use these types of cookies. In the event that we wish to use these types of cookies
      in the future, we will provide details of the cookies so that you can make an informed choice as to whether
      you consent to our use of them at that time.
      </Typography>
      <Typography variant='body1' gutterBottom>
      6.2.2. Performance cookies track how you use a website during your visit. Typically, this information is
      anonymous and aggregated, with information tracked across all site users. They help companies understand
      visitor usage patterns, identify and diagnose problems or errors their users may encounter, and make better
      strategic decisions in improving their audience&#39;s overall website experience. These cookies may be set by
      the website you are visiting or by third-party services. They do not collect personal information about you.
      We use performance cookies on our site.
      </Typography>
      <Typography variant='body1' gutterBottom>
      6.2.3. Functional cookies are used to collect information about your device and settings you may configure on the
      website you are visiting. With this information, websites can provide you with customized, enhanced, or
      optimized content and services. These cookies may be set by the website you are visiting or by third-parties
      services.
      </Typography>
      <Typography variant='body1' gutterBottom>
      We do not use this type of cookie on our site. In the event that we wish to use these types of cookies in the
      future, we will provide details of the cookies so that you can make an informed choice as to whether you
      consent to our use of them at that time.
      </Typography>
      <Typography variant='body1' gutterBottom>
      6.2.4. Targeting cookies help determine what promotional content is most relevant and appropriate to you and
      your interests. Website may use them to deliver targeted advertising or limit the number of times you see an
      advertisement. This helps companies improve the effectiveness of their campaigns and the quality of
      content presented to you. These cookies may be set by the website you are visiting or by third-party
      services. The advertising cookies set by third-parties may be used to track you on other websites that use
      the same third-party service.
      </Typography>
      <Typography variant='body1' gutterBottom>
      We do not use this type of cookie on our site. In the event that we wish to use these types of cookies in the
      future, we will provide details of the cookies so that you can make an informed choice as to whether you
      consent to our use of them at that time.
      </Typography>
      <Typography variant='body1' gutterBottom>
      6.3.- How can you manage cookies?
      </Typography>
      <Typography variant='body1' gutterBottom>
      6.3.1. Removing cookies from your device: You can delete all cookies that are already on your device by clearing
      the browsing history of your browser. This will remove all cookies from all websites you have visited.
      Be aware though that you may also lose some saved information (e.g., site preferences).
      </Typography>
      <Typography variant='body1' gutterBottom>
      6.3.2. Managing site-specific cookies: For more detailed control over site-specific cookies, check the privacy and
      cookie settings in your preferred browser.
      </Typography>
      <Typography variant='body1' gutterBottom>
      6.3.3. Blocking cookies: You can set most modern browsers to prevent any cookies being placed on your device,
      but you may then have to manually adjust some preferences every time you visit a site/page. And some
      services and functionalities may not work properly at all (e.g., profile logging-in).
      </Typography>
      <Typography variant='body1' gutterBottom>
      6.3.4. To find out more about cookies, including how to see what cookies have been set, visit:
      <ExternallUnsafeLink href='https://www.aboutcookies.org'/> or <ExternallUnsafeLink href='https://www.allaboutcookies.org'/>
      </Typography>
      <Typography variant='body1' gutterBottom>
      Find out how to manage cookies on popular browsers:
      <ul>
        <li>Google Chrome: <ExternallUnsafeLink href='https://support.google.com/chrome/answer/95647?hl=en'/></li>
        <li>Microsoft Edge: <ExternallUnsafeLink href='https://support.microsoft.com/en-gb/windows/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd'/></li>
        <li>Mozilla Firefox: <ExternallUnsafeLink href='https://support.mozilla.org/en-US/products/firefox/protect-your-privacy/cookies'/></li>
        <li>Microsoft Internet Explorer: <ExternallUnsafeLink href='https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64dn'/></li>
      </ul>
      To find information relating to other browsers, visit the browser developer&#39;s website.
      </Typography>
      <Typography variant='body1' gutterBottom>
        To opt out of being tracked by Google Analytics across all websites, visit&nbsp;
        <ExternallUnsafeLink href='https://tools.google.com/dlpage/gaoptout'/>
      </Typography>
      <Typography variant='h5' gutterBottom>
      7.- Use of social plug-ins
      </Typography>
      <Typography variant='body1' gutterBottom>
      7.1. Our website uses the provider&#39;s social plug-ins.
      </Typography>
      <Typography variant='body1' gutterBottom>
      7.2. These plug-ins collect data from you and transmit it to the respective vendor&#39;s server. We have taken
      technical measures to ensure the protection of your privacy, which guarantee that your data cannot be
      collected by the vendors of the respective plug-ins without your consent. These will initially be deactivated
      when you visit a site connected to the plug-ins. The plug-ins will not be activated until you click on the
      respective symbol, and by doing so, you give your consent to have your data transmitted to the respective
      vendor. The legal basis for plug-in use is Article 6(1)(a) GDPR.
      </Typography>
      <Typography variant='body1' gutterBottom>
      7.3. Once activated, the plug-ins also collect personally identifiable information, such as your IP address, and
      send it to the respective social plug-in&#39;s network. Activated social plug-ins also set a cookie with a unique
      identifier when you visit the respective website. This allows the social plug-in&#39;s network to generate
      profiles of your user behavior. This occurs even if you are not a member of the social plug-in&#39;s network. If
      you are a member of the social plug-in&#39;s network and you are logged into the website during your visit,
      your data and information about your visit to the website can be linked with your profile on the social plug-
      in&#39;s network. We do not have any influence over the exact extent to which your data is processed by the
      social plug-in network. For more information about the extent, nature, and purpose of data processing and
      about the rights and setting options for protecting your privacy, please see the data protection notices for
      the respective social network vendor. These can be found at the following addresses:
      <ul>
        <li>Facebook Inc., 1601 S California Ave., Palo Alto, CA 94304, USA.</li>
        <li>Twitter Inc., 795 Folsom St., Suite 600, San Francisco, CA 94107, USA.</li>
        <li>Instagram, Facebook Ireland Limited, 4 Grand Canal Square, Dublin 2, Ireland.</li>
        <li>YouTube LLC 901 Cherry Avenue, San Bruno, CA 94066, USA.</li>
        <li>LinkedIn Corporation 1000 W. Maude Avenue, Sunnyvale, CA 94085, USA.</li>
      </ul>
      </Typography>
      <Typography variant='h5' gutterBottom>
      8. User-generated content.
      </Typography>
      <Typography variant='body1' gutterBottom>
      Note that if you post information in a publicly accessible portion of our website or Services, it may be viewed by
      other users and potentially be further disclosed by those users. Please exercise caution when deciding to disclose
      such information.
      </Typography>
      <Typography variant='h5' gutterBottom>
      9.- Your rights
      </Typography>
      <Typography variant='body1' gutterBottom>
      Where the GDPR applies to the processing of your personal data you are entitled under such GDPR to the
      following rights:
      </Typography>
      <Typography variant='body1' gutterBottom>
      9.1. Right of access
      </Typography>
      <Typography variant='body1' gutterBottom>
      You are entitled to be informed inter alia about what personal data we process about you, for what
      purposes, and who are the recipients of your personal data.
      </Typography>
      <Typography variant='body1' gutterBottom>
      9.2. Right to rectification
      </Typography>
      <Typography variant='body1' gutterBottom>
      You have a right for any of your incomplete, inaccurate, or out-of-date personal data to be rectified.
      </Typography>
      <Typography variant='body1' gutterBottom>
      9.3. Right to erasure (&#39;right to be forgotten&#39;)
      </Typography>
      <Typography variant='body1' gutterBottom>
      You are entitled to the erasure of certain personal data that we have collected and processed about you.
      Please be aware that we might be allowed or even obliged to keep some of the personal data despite your
      deletion request.
      </Typography>
      <Typography variant='body1' gutterBottom>
      9.4. Right to restriction of processing
      </Typography>
      <Typography variant='body1' gutterBottom>
      In given cases such as when we process inaccurate personal data about you, or you deem the processing as
      no longer necessary, you may ask for a restriction of the processing.
      </Typography>
      <Typography variant='body1' gutterBottom>
      9.5. Right to data portability
      You have a right to receive personal data you provide us with in a structured, commonly used, and
      machine-readable format and to have it transmitted to another controller where technically feasible.
      </Typography>
      <Typography variant='body1' gutterBottom>
      9.6. Right to object
      </Typography>
      <Typography variant='body1' gutterBottom>
      You are entitled to object, on grounds relating to your particular situation, at any time to the processing of
      personal data that concerns you and is carried out in the public interest or for the purposes of legitimate
      interests pursued by us, including profiling.
      </Typography>
      <Typography variant='body1' gutterBottom>
      The exercise of your rights may be limited shall Winding Tree be obliged to keep any of your personal data
      for the purpose of compliance with legal obligations, for the establishment, exercise or defense of legal
      claims or any other compelling reasons as provided by the relevant data protection law.
      </Typography>
      <Typography variant='body1' gutterBottom>
      9.7. Right to not be subject to automated decision making
      </Typography>
      <Typography variant='body1' gutterBottom>
      You have the right not to be subject to a decision based solely on automated processing, including
      profiling, which produces legal effects concerning you or similarly significantly affects you. This does not
      apply if the decision: (a) is necessary for entering into, or performance of, a contract between you and us
      (b) is authorized by law and the law lays down suitable measures to safeguard your rights and freedoms and
      legitimate interests; or (c) is based on your explicit consent. Winding Tree does not make decisions based
      solely on automated processing that would have significant effects for Winding Tree user. For
      completeness, Winding Tree uses cookies and similar technologies the use of which may amount to
      profiling.
      </Typography>
      <Typography variant='body1' gutterBottom>
      Should you wish to exercise any of your rights, you may contact us at <ContactEmailLink/>. In the event
      that you make a request, we have one month to respond you.
      </Typography>
      <Typography variant='body1' gutterBottom>
      9.8. Right to file a complaint
      </Typography>
      <Typography variant='body1' gutterBottom>
      If you wish to file a complaint in regard to the processing of your personal data by us, you may contact our
      data processor officer at <ContactEmailLink/> who will undertake to resolve the issue.
      </Typography>
      <Typography variant='body1' gutterBottom>
      You can also contact your local data protection authority to lodge a complaint.
      </Typography>
      <Typography variant='h5' gutterBottom>
      10.- Children
      </Typography>
      <Typography variant='body1' gutterBottom>
      10.1 Our website is not targeted to children under 13 years of age and we do not knowingly collect personal
      information from children under 18 without parental consent.
      </Typography>
      <Typography variant='body1' gutterBottom>
      10.2. If we discover that the personal information of a child under 13 of age is in the system without parental
      consent, we will promptly delete such personal information from our systems.
      </Typography>
      <Typography variant='body1' gutterBottom>
      10.3. We encourage children of all ages to obtain their parent&#39;s or guardian&#39;s permission before sharing personal
      information with any website.
      </Typography>
      <Typography variant='h5' gutterBottom>
      11.- Contact details
      </Typography>
      <Typography variant='body1' gutterBottom>
      11.1. Should you wish to know more about Winding Tree, its protection of your privacy, or about this Privacy
      and Cookie Policy, you can contact Winding Tree at <ContactEmailLink/>.
      </Typography>
      <Typography variant='body1' gutterBottom>
      11.2. Please help Winding Tree ensures that your data is up to date. If you believe that some of the data
      processed by Winding Tree is incorrect, please contact at <ContactEmailLink/>.
      </Typography>
      </Box>
    </MainLayout>
    );
  };
  