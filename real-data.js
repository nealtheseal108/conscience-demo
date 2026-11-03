/* Neal's real Conscience account. Each task below is one of his open tasks on Tue Nov 3, 2026.
   Each draft is the text Conscience prepared for that task (from /api/headstart), copied as-is
   except where a blank marks the part Conscience said it couldn't prepare.
   The "read" lists summarize the sources each prepared draft cites. */
window.REAL = {
  tasks: [
    {
      id: "tom", form: "sheet", r: -1.8, x: "0rem", y: "0rem", rs: -1,
      title: "Thank-you note to Tom Luong at U.S. Bank",
      meta: "You added this after your final round. Due today.",
      status: "Draft ready",
      made: "draft",
      read: [
        { source: "Your task list", fact: "Thank-you note to Tom Luong (Final B, Nov 2). Mention agent identity, x402 and foreign money movement." },
        { source: "Your interview transcript", fact: "Tom said foreign money movement is the first practical use for a stablecoin, and that a bank weighs the investment against the regulatory cost. He told you to go out and build, not just read." }
      ],
      missing: "Tom's email address. It isn't in any file Conscience can read, so look it up in your Final B invite.",
      fields: [
        { label: "To", value: "Tom Luong" },
        { label: "Subject", value: "Thank you – U.S. Bank Product Management Internship" }
      ],
      body: [
        "Hi Tom,",
        "Thank you for taking the time to speak with me on Monday for the final round. I enjoyed the conversation.",
        "Your point that foreign money movement is the first practical use case for a stablecoin, and that an institution has to weigh the investment and the regulatory cost, gave me a clearer view of how a bank decides what to build first. It also connected to what I mentioned about x402. It is Coinbase's protocol for letting AI agents pay for web content in tiny stablecoin payments. Your comment that payments may one day run machine-to-machine was an interesting way to put it.",
        "I also took your advice to go out and build, not just read. I'll keep building with x402 and agent payments.",
        "I'm excited about the chance to join U.S. Bank in Minneapolis next summer. Thank you again for your time.",
        "Best,\nNeal"
      ],
      wall: "Conscience stopped here. Change anything you like, then approve.",
      action: "Approve, I'll send it",
      toast: "Approved. Nothing was sent from this page."
    },
    {
      id: "ojas", form: "sheet", r: 1.4, x: ".5rem", y: ".8rem", rs: .8,
      title: "Follow up with Ojas about Moonshot",
      meta: "You added this in September. It has rolled over 10 times.",
      status: "Draft ready",
      made: "draft",
      read: [
        { source: "Your task list", fact: "Send the message asking to join Moonshot. It's his YC company, in the same space as Conscience. First due Sept 10, rolled over 10 times." }
      ],
      missing: "What Moonshot does, and your last message with Ojas. Nothing Conscience can read covers them, so the line about Moonshot is left blank.",
      body: [
        "Hey Ojas,",
        { before: "Following up on Moonshot. I'd like to join you on it. I'm building Conscience, an accountability tool that does the routine work for you and stops where it needs a person. ", blank: "how Moonshot fits Conscience", after: "" },
        "Could we find 20 minutes this week to talk about where I could help most?"
      ],
      wall: "Conscience stopped here. Fill in the blank, change anything you like, then approve.",
      wallFilled: "Conscience stopped here. Change anything you like, then approve.",
      action: "Approve, I'll send it",
      toast: "Approved. Nothing was sent from this page."
    },
    {
      id: "cargurus", form: "sheet", r: 1.1, x: "-.3rem", y: ".3rem", rs: 1.2,
      title: "Re-apply to CarGurus and tell the recruiter",
      meta: "From a recruiter's email. Due today.",
      status: "Links and reply ready",
      made: "draft",
      read: [
        { source: "Your task list", fact: "Recruiter Jorge Oliveira asked on Oct 23 that you re-apply through RippleMatch: PM intern and TPM intern, Boston. No GPA minimum." },
        { source: "Your files", fact: "A tailored resume exists for each role: CarGurus-PM and CarGurus-TPM." }
      ],
      missing: "Whether both postings are still open. Conscience can't browse RippleMatch, so check before you apply.",
      fields: [
        { label: "To", value: "Jorge Oliveira" }
      ],
      body: [
        "Hi Jorge,",
        "Thank you for pointing me to RippleMatch. I've applied to both the Product Manager intern and Technical Program Manager intern roles in Boston, using a resume tailored to each. I'm happy to share anything else you need, and I appreciate your help.",
        "Best,\nNeal"
      ],
      wall: "Conscience stopped here. Apply to both roles first, then approve the reply.",
      action: "Approve, I'll send it",
      toast: "Approved. Nothing was sent from this page."
    },
    {
      id: "van", form: "card", r: 2, x: ".6rem", y: ".55rem", rs: .9,
      title: "Prepare for the 1:1 with Van at 6:15 PM",
      meta: "Every Tuesday. Due tonight.",
      status: "Talking points ready",
      made: "talking points",
      read: [
        { source: "Your task list", fact: "WSIP 1:1 with Van, Tuesdays 6:15 PM ET. Show integration-assistant progress." },
        { source: "Your files, WSIP update for Van (Nov 2)", fact: "The Oct 30 deliverable is met. xMIL run 1 on Macon passed for $1.47. 25 methods raised 227 required decisions, and 91 are still open." },
        { source: "Your files, the update's open asks", fact: "Van's list of about 10 methods, lab defaults, equivalence margins and GPU clearance." }
      ],
      heading: "Talking points for Van",
      body: [
        { label: "What I built since the last check-in", text: "The A/B line you asked for on Oct 30 is met. Every change is labeled A or B before code is written, plain code checks the plan against the diff, and framework edits stay in their own patch. Real Haiku agents integrated xMIL with 0 framework files." },
        { label: "Live demo", text: "xMIL run 1 on Macon: passed end to end for $1.47, exact parity on 2 of 2 cases, 9 of 9 mutations caught." },
        { label: "Open problems and blockers", text: "Across 25 methods, reviewers raised 227 required decisions, about 9 per method. 91 are still open. Missing packages stopped two runs, and agents asked for framework changes they didn't need." },
        { label: "What I'll do before next Tuesday", text: "Pinned images for more methods, tests that count unneeded stops, and the 10-method stress test once I have your list." },
        { label: "What I need from Van", text: "Your list of about 10 methods, a ruling on the lab defaults file, equivalence margins and GPU clearance. Please check the xMIL eight-bag change first." }
      ],
      wall: "Conscience stopped here. Change anything you like, then take it into the 6:15 PM meeting.",
      action: "Approve talking points",
      toast: "Approved. Nothing was sent from this page."
    },
    {
      id: "video", form: "card", r: -1.3, x: "1.1rem", y: ".9rem", rs: -1.1,
      title: "Record the Sandbox round 2 video",
      meta: "You added this. Due tomorrow.",
      status: "Yours to do",
      made: "answer",
      read: [],
      plain: "Nothing to prepare. You're recording it right now.",
      wall: "Only you can do this one. Mark it done when you have.",
      action: "Mark done",
      toast: "Marked done."
    }
  ]
};
