import React from "react";
import { IStation } from "../../../types/models";

interface IPreview {
  isVisible: boolean;
  station: IStation;
  inventory: any;
  closePreview: () => void;
}

const Preview: React.FC<IPreview> = ({
  isVisible,
  station,
  inventory,
  closePreview,
}) => {
  if (!inventory || inventory.length === 0) {
    return (
      <div
        className={`preview__container preview__container--${
          isVisible && station && inventory && "active"
        }`}
      >
        <div className="preview__close" onClick={() => closePreview()}>
          <span>X</span>
        </div>

        <div className="preview__header"></div>

        <div className="preview__description__container">
          <span>
            <p>
              <strong>No Data Found for satellite {station?.name} </strong>{" "}
            </p>
            <p> NORAD {station?.satrec.satnum}</p>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`preview__container preview__container--${
        isVisible && station && inventory && "active"
      }`}
    >
      <div className="preview__close" onClick={() => closePreview()}>
        <span>X</span>
      </div>

      <div className="preview__header"></div>

      <div className="preview__description__container">
        <span>
          <p>
            <strong>Norad Number:</strong> {inventory?.norad_number}
          </p>
        </span>

        <span>
          <p>
            <strong>Name:</strong> {inventory?.official_name}
          </p>
        </span>

        <span>
          <p>
            <strong>Country:</strong> {inventory?.country_owner}
          </p>
        </span>

        <span>
          <p>
            <strong>Owner:</strong> {inventory?.owner}
          </p>
        </span>

        <span>
          <p>
            <strong>Purpose:</strong>
            {inventory?.users} - {inventory?.purpose} -{" "}
            {inventory?.detailed_purpose}
          </p>
        </span>

        <span>
          <p>
            <strong>Class Of Orbit:</strong> {inventory?.class_of_orbit}
          </p>
        </span>

        <span>
          <p>
            <strong>Perigee:</strong> {inventory?.perigee} degrees
          </p>
        </span>

        <span>
          <p>
            <strong>Apogee:</strong> {inventory?.apogee} degrees
          </p>
        </span>

        <span>
          <p>
            <strong>Eccentricity:</strong> {inventory?.eccentricity}
          </p>
        </span>

        <span>
          <p>
            <strong>Inclination:</strong> {inventory?.inclination} degrees
          </p>
        </span>

        <span>
          <p>
            <strong>Period:</strong> {inventory?.period} (minutes)
          </p>
        </span>

        <span>
          <p>
            <strong>Date Of Launch:</strong> {inventory?.date_of_launch}
          </p>
        </span>

        <span>
          <p>
            <strong>Expected Lifetime:</strong>{" "}
            {inventory?.expected_lifetime
              ? inventory?.expected_lifetime + " years"
              : ""}{" "}
          </p>
        </span>

        {inventory?.source.length > 0 ? (
          <div style={{ display: "flex" }}>
            <a
              className="preview__button"
              href={inventory?.source}
              target="_blank"
              rel="noreferrer"
            >
              See more
            </a>
          </div>
        ) : (
          ""
        )}

        {inventory?.source__1.length > 0 ? (
          <div style={{ display: "flex" }}>
            <a
              className="preview__button"
              href={inventory?.source__1}
              target="_blank"
              rel="noreferrer"
            >
              See more
            </a>
          </div>
        ) : (
          ""
        )}

        {inventory?.source__2.length > 0 ? (
          <div style={{ display: "flex" }}>
            <a
              className="preview__button"
              href={inventory?.source__2}
              target="_blank"
              rel="noreferrer"
            >
              See more
            </a>
          </div>
        ) : (
          ""
        )}

        {inventory?.source__3.length > 0 ? (
          <div style={{ display: "flex" }}>
            <a
              className="preview__button"
              href={inventory?.source__3}
              target="_blank"
              rel="noreferrer"
            >
              See more
            </a>
          </div>
        ) : (
          ""
        )}

        {inventory?.source__4.length > 0 ? (
          <div style={{ display: "flex" }}>
            <a
              className="preview__button"
              href={inventory?.source__4}
              target="_blank"
              rel="noreferrer"
            >
              See more
            </a>
          </div>
        ) : (
          ""
        )}

        {inventory?.source__5.length > 0 ? (
          <div style={{ display: "flex" }}>
            <a
              className="preview__button"
              href={inventory?.source__5}
              target="_blank"
              rel="noreferrer"
            >
              See more
            </a>
          </div>
        ) : (
          ""
        )}

        <span>
          <p>
            <strong>Comments:</strong> {inventory?.comments}
          </p>
        </span>
      </div>
    </div>
  );
};

export default Preview;
