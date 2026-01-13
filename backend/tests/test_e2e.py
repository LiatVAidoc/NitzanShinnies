import pytest
from playwright.sync_api import Page, expect

@pytest.fixture(scope="session")
def base_url():
    return "http://localhost:3000"

@pytest.fixture
def authenticated_page(page: Page, base_url):
    page.goto(base_url)
    # Check if we are on login page
    if page.locator('text=Login with SSO').is_visible():
        page.click('text=Login with SSO')
        # Wait for redirect and login completion (DicomViewer should appear)
        # We can check for the Input field for S3 path
        expect(page.locator('input[placeholder="e.g., my-bucket/path/to/image.dcm"]')).to_be_visible(timeout=10000)
    return page

def test_homepage_title(page: Page, base_url):
    page.goto(base_url)
    # This title is present on both Login and Main app
    expect(page).to_have_title("DICOM Metadata Viewer")

def test_dicom_error_handling(authenticated_page: Page):
    page = authenticated_page
    
    # Input path
    page.fill('input[placeholder="e.g., my-bucket/path/to/image.dcm"]', "test-bucket/test-file.dcm")
    
    # Click Load
    page.click('button:has-text("Load")')
    
    # Verify Error Alert
    # We expect "S3 Error: An error occurred (403) when calling the HeadObject operation: Forbidden"
    error_alert = page.locator('.MuiAlert-message')
    expect(error_alert).to_be_visible(timeout=5000)
    expect(error_alert).to_contain_text("S3 Error")
    expect(error_alert).to_contain_text("Forbidden")

def test_initial_ui_state(authenticated_page: Page):
    page = authenticated_page
    
    # Check Header
    expect(page.locator('text=AiDoc Viewer')).to_be_visible()
    
    # Check Button Disabled State (Initially Empty)
    load_button = page.locator('button', has_text="Load")
    expect(load_button).to_be_disabled()

def test_persistent_table_placeholder(authenticated_page: Page):
    page = authenticated_page
    
    # Verify placeholder text exists when no data is loaded
    placeholder = page.locator('text=No metadata loaded. Please enter a path and click Load.')
    expect(placeholder).to_be_visible()

def test_custom_fields_loading(authenticated_page: Page):
    page = authenticated_page
    
    # Open Settings
    # Use robust selector via aria-label
    page.click('button[aria-label="Load Configuration"]')
    
    # Check Dialog
    expect(page.locator('text=Load Configuration')).to_be_visible()
    
    # Select "Select Custom Fields" radio
    # The radio button has value="custom"
    page.click('input[name="loading-mode"][value="custom"]')
    
    # Enter fields
    page.fill('textarea', 'PatientID')
    
    # Verify Chips are present
    expect(page.locator('text=Common Fields')).to_be_visible()
    # Expect the chip "PatientID" to be visible (it is a button)
    expect(page.locator('role=button[name="PatientID"]')).to_be_visible()
    
    # Close
    page.click('text=Close')
    
    # Now verify the text changed (Loading Mode: Custom Fields)
    # The summary text logic in DicomViewer wasn't changed, but let's confirm.
    expect(page.locator('text=Loading Mode: Custom Fields')).to_be_visible()


