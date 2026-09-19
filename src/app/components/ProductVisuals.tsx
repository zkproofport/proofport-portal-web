import Image from "next/image";
import { Fragment } from "react";
import styles from "../product.module.css";

/* Connectors share a 1.5px stroke and a 5px arrowhead. SVG coordinates are
   unscaled CSS pixels; layout, rather than offsets, sets the node centers. */
function VerticalConnector({ directed = false }: { directed?: boolean }) {
  return (
    <svg className={styles.verticalConnector} width="24" height="56" viewBox="0 0 24 56" fill="none" aria-hidden="true" focusable="false">
      <path d={directed ? "M12 0v55" : "M12 0v56"} />
      {directed && <path d="m7 50 5 5 5-5" />}
    </svg>
  );
}

export function BrandMark({ size = 40, priority = false }: { size?: number; priority?: boolean }) {
  return <Image src="/logo.png" alt="" width={size} height={size} priority={priority} className={styles.brandMark} />;
}

export function ProductFlow() {
  const steps = [
    { label: "Trusted fact", body: <>Existing<br />credential</>, detail: "Private input" },
    { label: "ZKProofport", body: <BrandMark size={104} />, detail: "Prove the condition" },
    { label: "Eligibility proof", body: <span className={styles.corePredicate}>ELIGIBLE <strong>= TRUE</strong></span>, detail: "The required condition" },
    { label: "Application", body: <>Verify.<br />Act.</>, detail: "Use the proof" },
  ];
  return (
    <div className={styles.flow} role="list" aria-label="Trusted fact to application action">
      {steps.map((step, index) => (
        <Fragment key={step.label}>
          {index > 0 && <svg className={styles.flowConnector} width="48" height="24" viewBox="0 0 48 24" fill="none" aria-hidden="true"><path d="M0 12h47m-5-5 5 5-5 5" /></svg>}
          <div className={styles.flowStep} role="listitem">
            <h3 className={styles.diagramLabel}>{step.label}</h3>
            <div className={styles.flowBody}>{step.body}</div>
            <p>{step.detail}</p>
          </div>
        </Fragment>
      ))}
    </div>
  );
}

export function HeroProof() {
  return (
    <figure className={styles.heroProof} aria-label="Private input passes through ZKProofport to become an eligibility proof">
      <div className={styles.privateSample}>
        <span className={styles.diagramLabel}>Private input</span>
        <div className={styles.hiddenLines} aria-hidden="true"><i /><i /><i /></div>
      </div>
      <VerticalConnector />
      <div className={styles.heroTransform}><BrandMark size={104} priority /><span>ZKProofport</span></div>
      <VerticalConnector directed />
      <div className={styles.publicSample}>
        <span className={styles.diagramLabel}>Eligibility proof</span>
        <p className={styles.heroPredicate}>ELIGIBLE <span>= TRUE</span></p>
      </div>
    </figure>
  );
}

/* Equal-width grid columns put the output ports at W/4 and 3W/4.
   Their paths meet at W/2, with identical 40px drops and W/4 horizontal runs.
   Zero gaps between grid, SVG and destination make the edges continuous. */
function MergeConnector() {
  return (
    <svg className={styles.mergeConnector} width="100%" height="88" fill="none" aria-hidden="true" focusable="false">
      <line x1="25%" y1="0" x2="25%" y2="40" />
      <line x1="75%" y1="0" x2="75%" y2="40" />
      <line x1="25%" y1="40" x2="75%" y2="40" />
      <line x1="50%" y1="40" x2="50%" y2="88" />
      <circle cx="50%" cy="40" r="3" />
    </svg>
  );
}

export function ProvingEnvironments() {
  return (
    <figure className={styles.environments} aria-label="People prove locally on a user device; AI agents use supported TEE deployments. Both produce an eligibility proof that an application verifies.">
      <div className={styles.provingLanes}>
        <div className={styles.provingLane}>
          <div className={styles.laneHeading}><h3>People</h3><p className={styles.environmentName}>User device</p></div>
          <div className={styles.laneFlow}><span>Private witness</span><VerticalConnector /><strong className={styles.processNode}>Local proof</strong></div>
        </div>
        <div className={styles.provingLane}>
          <div className={styles.laneHeading}><h3>AI agents</h3><p className={styles.environmentName}>TEE</p></div>
          <div className={styles.laneFlow}><span>Agent request</span><VerticalConnector /><strong className={styles.processNode}>TEE proving</strong></div>
        </div>
      </div>
      <MergeConnector />
      <div className={styles.sharedProof}>Eligibility proof</div>
      <VerticalConnector directed />
      <figcaption className={styles.sharedDestination}><span>Application</span><p>One interface to verify the result.</p></figcaption>
    </figure>
  );
}

export function PolicyComposition() {
  return (
    <figure className={styles.policyDiagram} aria-label="Future composition: address control AND a balance threshold must both hold. The address flow is a GIWA Sepolia prototype; balance and combined proofs are future directions.">
      <div className={styles.policyLanes}>
        <div className={styles.policyLane}><span className={styles.policyStatus}>GIWA Sepolia prototype</span><h3>Verified address</h3><p className={styles.processNode}>Address control<strong>= TRUE</strong></p></div>
        <div className={styles.policyLane}><span className={styles.policyStatus}>Future direction</span><h3>Verified balance</h3><p className={styles.processNode}>Balance<strong>≥ X</strong></p></div>
      </div>
      <MergeConnector />
      <div className={styles.policyMerge}>
        <span className={styles.logicGate} aria-label="Both conditions must hold">AND</span>
        <VerticalConnector directed />
        <strong className={styles.composedResult}>ELIGIBLE</strong>
        <span className={styles.futureLabel}>Future composition</span>
      </div>
      <figcaption className={styles.smallNote}>GIWA uses a test attester. Balance conditions and composite proofs are future work.</figcaption>
    </figure>
  );
}
