"use client";

import { useState } from "react";
import productsData from "@/data/products.json";

// Trim helper equivalent to the original Trim() (strips all whitespace)
const trim = (str) => str.replace(/\s/g, "");

// Format a date like "18 May, 2021 01:43:50 am IST" (India Standard Time).
function formatAuthDate(date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).formatToParts(date);

  const get = (type) => parts.find((p) => p.type === type)?.value || "";
  const day = get("day");
  const month = get("month");
  const year = get("year");
  const hour = get("hour");
  const minute = get("minute");
  const second = get("second");
  const period = get("dayPeriod").toLowerCase();

  return `${day} ${month}, ${year} ${hour}:${minute}:${second} ${period} IST`;
}

// Look up a genuine product. Comparisons are CASE SENSITIVE (values are trimmed
// of surrounding whitespace only). Serial is compared only when required.
function findGenuine({ mfgDate, serialNumber, authCode, serialRequired }) {
  const code = trim(authCode);
  const serial = trim(serialNumber);
  return productsData.products.find((p) => {
    if (trim(p.authCode) !== code) return false;
    if (serialRequired && trim(p.serialNumber) !== serial) return false;
    return true;
  });
}

export default function AuthForm() {
  const id = 1; // hidden "id" field from the original form

  const [mfgDate, setMfgDate] = useState("1");
  const [serialNumber, setSerialNumber] = useState("");
  const [authCode, setAuthCode] = useState("");

  // Red-border error flags, mirroring the legacy inline validation
  const [serialError, setSerialError] = useState(false);
  const [authError, setAuthError] = useState(false);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Serial Number is only required for "02 / 2022 or before" (mfg_date === "1"),
  // matching display_serial_no / validatePage in the original js.js
  const serialRequired = mfgDate === "1";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (loading) return;

    let hasError = false;
    setSerialError(false);
    setAuthError(false);

    if (id === 1 && serialRequired && trim(serialNumber) === "") {
      setSerialError(true);
      hasError = true;
    }
    if (trim(authCode) === "") {
      setAuthError(true);
      hasError = true;
    }

    if (hasError) {
      setResult(null);
      return;
    }

    // Verify against the genuine-products list (data/products.json).
    const match = findGenuine({
      mfgDate,
      serialNumber,
      authCode,
      serialRequired,
    });

    // Wait 2s before showing the result.
    setLoading(true);
    setTimeout(() => {
      if (match) {
        setResult({
          status: "authenticated",
          product: match,
          date: formatAuthDate(new Date()),
        });
      } else {
        setResult({ status: "not_authenticated" });
      }
      setLoading(false);
    }, 2000);
  };

  const inputStyle = (isError) => ({
    height: "14px",
    width: "145px",
    border: isError ? "solid 1px red" : undefined,
  });

  // Once a result exists, replace the whole window content: keep only the
  // background image and show the return message.
  if (result) {
    return (
      <table className="auth-window">
        <tbody>
          <tr>
            <td height="118" align="left" valign="top"></td>
          </tr>
          <tr>
            <td align="center" valign="top">
              <br />
              <br />
              {result.status === "authenticated" ? (
                <div className="auth-success">
                  <div className="auth-success-text">
                    Your product has previously been successfully authenticated
                    on {result.date}.
                  </div>
                </div>
              ) : (
                <div className="auth-warning">
                  <div className="auth-warning-title">WARNING!</div>
                  <div className="auth-warning-text">
                    Your Product could not be Authenticated!
                  </div>
                  <div className="auth-warning-text">
                    Do not Purchase this product or return it to the pharmacy!
                  </div>
                  <div className="auth-warning-text">
                    Your Product could not be Authenticated!
                  </div>
                </div>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  return (
    <table className="auth-window">
      <tbody>
        <tr>
          <td height="118" align="left" valign="top"></td>
        </tr>
        <tr>
          <td align="center" valign="top">
            <form id="form1" name="form1" onSubmit={handleSubmit}>
              <table className="inner-table">
                <tbody>
                  <tr>
                    <td align="left" valign="top">
                      <br />
                      <br />
                      <table className="fields-table">
                        <tbody>
                          {/* Mfg. Date */}
                          <tr>
                            <td align="left" valign="top">
                              <span className="style4">Mfg. Date:</span>
                            </td>
                          </tr>
                          <tr>
                            <td align="left" valign="top">
                              <select
                                name="mfg_date"
                                id="mfg_date"
                                className="mfg-select"
                                value={mfgDate}
                                onChange={(e) => setMfgDate(e.target.value)}
                              >
                                <option value="1">02 / 2022 or before</option>
                                <option value="2">03 / 2022 or after</option>
                              </select>
                            </td>
                          </tr>
                          <tr className="spacer-row">
                            <td align="left" valign="top"></td>
                          </tr>

                          {/* Serial Number (only for 02/2022 or before) */}
                          {serialRequired && (
                            <>
                              <tr>
                                <td align="left" valign="top">
                                  <span className="style4">Serial Number:</span>
                                </td>
                              </tr>
                              <tr>
                                <td align="left" valign="top">
                                  <input
                                    type="text"
                                    name="sid"
                                    id="sid"
                                    value={serialNumber}
                                    onChange={(e) =>
                                      setSerialNumber(e.target.value)
                                    }
                                    style={inputStyle(serialError)}
                                  />
                                </td>
                              </tr>
                              <tr className="spacer-row">
                                <td align="left" valign="top"></td>
                              </tr>
                            </>
                          )}

                          {/* Authentication Code */}
                          <tr>
                            <td align="left" valign="top">
                              <span className="style4">
                                Authentication Code:
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td align="left" valign="top">
                              <input
                                type="text"
                                name="seid"
                                id="seid"
                                value={authCode}
                                onChange={(e) => setAuthCode(e.target.value)}
                                style={inputStyle(authError)}
                              />
                            </td>
                          </tr>

                          {/* Submit */}
                          <tr>
                            <td align="center" valign="top">
                 
                              <input
                                type="image"
                                src="/submit_button.jpg"
                                name="Submit"
                                alt="Submit"
                                className="submit-image"
                              />
                            </td>
                          </tr>

                        </tbody>
                      </table>
                    </td>
                  </tr>

                  {/* Note + Warning */}
                  <tr>
                    <td align="left" valign="top">
                      <table className="inner-table">
                        <tbody>
                          <tr>
                            <td align="left" valign="top">
                              <span className="style4">
                                <strong>Note:</strong>
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td
                              align="justify"
                              valign="middle"
                              className="style6"
                            >
                              Each product can only be authenticated
                              <br />
                              once. All fields are case sensitive.
                            </td>
                          </tr>
                          <tr>
                            <td align="left" valign="top">
                              <span className="style4">
                                <strong>Warning:</strong>
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td
                              align="justify"
                              valign="middle"
                              className="style6"
                            >
                              We strongly discourage anyone from purchasing our
                              products as loose ampoules/trays or blisters/strips
                              without cartons. All genuine Alpha-Pharma products are
                              always supplied in a tamper proof carton with
                              intact silver scratch field except for Oral Strips
                              which has no authentication features.
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
