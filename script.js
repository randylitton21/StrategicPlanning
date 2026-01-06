// Strategic Planning Workflow Script

var currentStep = 1;
var totalSteps = 7;
var planData = {
    businessName: '',
    userName: '',
    vision: '',
    values: '',
    mission: '',
    strengths: '',
    weaknesses: '',
    opportunities: '',
    threats: '',
    goals: [],
    targetsInitiatives: '',
    kpis: '',
    strategyMap: '',
    marketing: '',
    sales: '',
    operations: '',
    administration: '',
    mindMap: '',
    reviewFrequency: 'quarterly',
    successCriteria: '',
    notes: ''
};
var userDataBackup = null; // Store user's data when loading sample data

// Initialize on page load
function init() {
    loadSavedData();
    updateProgress();
    setupEventListeners();
    setupCharacterCounts();
    setupKeyboardNavigation();
    updateStepCompletion();
}

// Setup event listeners for auto-save
function setupEventListeners() {
    var inputs = document.querySelectorAll('input, textarea, select');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('input', function() {
            saveData();
            updateCharacterCount(this);
            updateStepCompletion();
        });
        inputs[i].addEventListener('change', function() {
            saveData();
            updateStepCompletion();
        });
    }
}

// Setup character counts
function setupCharacterCounts() {
    var elements = document.querySelectorAll('[data-char-count]');
    for (var i = 0; i < elements.length; i++) {
        updateCharacterCount(elements[i]);
    }
}

// Update character count for a textarea or input
function updateCharacterCount(element) {
    var countEl = null;
    if (element.id) {
        countEl = document.getElementById(element.id + '-count');
    } else {
        // Handle class-based elements
        var className = element.className.split(' ')[0];
        if (className === 'proponent-marketing') {
            countEl = document.getElementById('marketing-count');
        } else if (className === 'proponent-sales') {
            countEl = document.getElementById('sales-count');
        } else if (className === 'proponent-operations') {
            countEl = document.getElementById('operations-count');
        } else if (className === 'proponent-administration') {
            countEl = document.getElementById('administration-count');
        }
    }
    if (countEl) {
        var count = element.value.length;
        countEl.textContent = count + ' characters';
    }
}

// Setup keyboard navigation
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Only navigate if not typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        if (e.key === 'ArrowRight' && currentStep < totalSteps) {
            nextStep();
        } else if (e.key === 'ArrowLeft' && currentStep > 1) {
            prevStep();
        }
    });
}

// Save data to localStorage
function saveData() {
    // Save step 1 data (Purpose)
    planData.businessName = document.getElementById('business-name') ? document.getElementById('business-name').value : '';
    planData.userName = document.getElementById('user-name') ? document.getElementById('user-name').value : '';
    planData.vision = document.getElementById('vision') ? document.getElementById('vision').value : '';
    planData.values = document.getElementById('values') ? document.getElementById('values').value : '';
    planData.mission = document.getElementById('mission') ? document.getElementById('mission').value : '';
    
    // Save step 2 data is educational only, no data to save
    
    // Save step 3 data (Mind Map - Proponents)
    var marketingEl = document.querySelector('.proponent-marketing');
    planData.marketing = marketingEl ? marketingEl.value : '';
    var salesEl = document.querySelector('.proponent-sales');
    planData.sales = salesEl ? salesEl.value : '';
    var operationsEl = document.querySelector('.proponent-operations');
    planData.operations = operationsEl ? operationsEl.value : '';
    var administrationEl = document.querySelector('.proponent-administration');
    planData.administration = administrationEl ? administrationEl.value : '';
    
    // Save step 4 data (SWOT)
    planData.strengths = document.getElementById('strengths') ? document.getElementById('strengths').value : '';
    planData.weaknesses = document.getElementById('weaknesses') ? document.getElementById('weaknesses').value : '';
    planData.opportunities = document.getElementById('opportunities') ? document.getElementById('opportunities').value : '';
    planData.threats = document.getElementById('threats') ? document.getElementById('threats').value : '';
    
    // Save step 5 data (Strategy - Goals)
    saveGoals();
    
    // Save step 6 data (Execution)
    planData.targetsInitiatives = document.getElementById('targets-initiatives') ? document.getElementById('targets-initiatives').value : '';
    planData.kpis = document.getElementById('kpis') ? document.getElementById('kpis').value : '';
    planData.strategyMap = document.getElementById('strategy-map') ? document.getElementById('strategy-map').value : '';
    
    // Save step 7 data (Review)
    planData.reviewFrequency = document.getElementById('review-frequency') ? document.getElementById('review-frequency').value : 'quarterly';
    planData.successCriteria = document.getElementById('success-criteria') ? document.getElementById('success-criteria').value : '';
    planData.notes = document.getElementById('notes') ? document.getElementById('notes').value : '';
    
    try {
        localStorage.setItem('strategicPlan', JSON.stringify(planData));
        showSaveIndicator();
    } catch (e) {
        console.log('LocalStorage not available');
    }
}

// Show save indicator
function showSaveIndicator() {
    var indicator = document.getElementById('saveIndicator');
    if (indicator) {
        indicator.classList.add('show');
        setTimeout(function() {
            indicator.classList.remove('show');
        }, 2000);
    }
}

// Load saved data from localStorage
function loadSavedData() {
    try {
        var saved = localStorage.getItem('strategicPlan');
        if (saved) {
            planData = JSON.parse(saved);
            populateForm();
        }
    } catch (e) {
        console.log('Could not load saved data');
    }
}

// Populate form with saved data
function populateForm() {
    if (document.getElementById('business-name')) document.getElementById('business-name').value = planData.businessName || '';
    if (document.getElementById('user-name')) document.getElementById('user-name').value = planData.userName || '';
    if (document.getElementById('vision')) document.getElementById('vision').value = planData.vision || '';
    if (document.getElementById('values')) document.getElementById('values').value = planData.values || '';
    if (document.getElementById('mission')) document.getElementById('mission').value = planData.mission || '';
    if (document.getElementById('strengths')) document.getElementById('strengths').value = planData.strengths || '';
    if (document.getElementById('weaknesses')) document.getElementById('weaknesses').value = planData.weaknesses || '';
    if (document.getElementById('opportunities')) document.getElementById('opportunities').value = planData.opportunities || '';
    if (document.getElementById('threats')) document.getElementById('threats').value = planData.threats || '';
    if (document.getElementById('targets-initiatives')) document.getElementById('targets-initiatives').value = planData.targetsInitiatives || '';
    if (document.getElementById('kpis')) document.getElementById('kpis').value = planData.kpis || '';
    if (document.getElementById('strategy-map')) document.getElementById('strategy-map').value = planData.strategyMap || '';
    if (document.getElementById('review-frequency')) document.getElementById('review-frequency').value = planData.reviewFrequency || 'quarterly';
    if (document.getElementById('success-criteria')) document.getElementById('success-criteria').value = planData.successCriteria || '';
    if (document.getElementById('notes')) document.getElementById('notes').value = planData.notes || '';
    
    var marketingEl = document.querySelector('.proponent-marketing');
    if (marketingEl) marketingEl.value = planData.marketing || '';
    var salesEl = document.querySelector('.proponent-sales');
    if (salesEl) salesEl.value = planData.sales || '';
    var operationsEl = document.querySelector('.proponent-operations');
    if (operationsEl) operationsEl.value = planData.operations || '';
    var administrationEl = document.querySelector('.proponent-administration');
    if (administrationEl) administrationEl.value = planData.administration || '';
    
    loadGoals();
    setupCharacterCounts();
    updateStepCompletion();
}

// Navigate to next step
function nextStep() {
    if (currentStep < totalSteps) {
        hideStep(currentStep);
        currentStep++;
        showStep(currentStep);
        updateProgress();
        saveData();
        // Scroll to top of step
        window.scrollTo(0, 0);
    }
}

// Navigate to previous step
function prevStep() {
    if (currentStep > 1) {
        hideStep(currentStep);
        currentStep--;
        showStep(currentStep);
        updateProgress();
        saveData();
        // Scroll to top of step
        window.scrollTo(0, 0);
    }
}

// Show step
function showStep(step) {
    var stepElement = document.getElementById('step' + step);
    if (stepElement) {
        stepElement.classList.add('active');
    }
}

// Hide step
function hideStep(step) {
    var stepElement = document.getElementById('step' + step);
    if (stepElement) {
        stepElement.classList.remove('active');
    }
}

// Update progress bar
function updateProgress() {
    var progressFill = document.getElementById('progressFill');
    var progressText = document.getElementById('progressText');
    var percentage = (currentStep / totalSteps) * 100;
    
    if (progressFill) {
        progressFill.style.width = percentage + '%';
    }
    
    if (progressText) {
        progressText.textContent = 'Step ' + currentStep + ' of ' + totalSteps;
    }
    
    // Update step navigation dots
    updateStepDots();
}

// Update step navigation dots
function updateStepDots() {
    var dots = document.querySelectorAll('.step-dot');
    for (var i = 0; i < dots.length; i++) {
        var stepNum = parseInt(dots[i].getAttribute('data-step'));
        dots[i].classList.remove('active', 'complete');
        
        if (stepNum === currentStep) {
            dots[i].classList.add('active');
        } else if (stepNum < currentStep || isStepComplete(stepNum)) {
            dots[i].classList.add('complete');
        }
    }
}

// Check if a step is complete
function isStepComplete(step) {
    switch(step) {
        case 1:
            var businessName = document.getElementById('business-name');
            var userName = document.getElementById('user-name');
            var vision = document.getElementById('vision');
            var values = document.getElementById('values');
            var mission = document.getElementById('mission');
            return (businessName && businessName.value.trim()) || (userName && userName.value.trim()) || 
                   (vision && vision.value.trim()) || (values && values.value.trim()) || (mission && mission.value.trim());
        case 2:
            return true; // Educational step, always complete
        case 3:
            var marketing = document.querySelector('.proponent-marketing');
            var sales = document.querySelector('.proponent-sales');
            var operations = document.querySelector('.proponent-operations');
            var administration = document.querySelector('.proponent-administration');
            return (marketing && marketing.value.trim()) || (sales && sales.value.trim()) || 
                   (operations && operations.value.trim()) || (administration && administration.value.trim());
        case 4:
            var strengths = document.getElementById('strengths');
            var weaknesses = document.getElementById('weaknesses');
            var opportunities = document.getElementById('opportunities');
            var threats = document.getElementById('threats');
            return (strengths && strengths.value.trim()) || (weaknesses && weaknesses.value.trim()) || 
                   (opportunities && opportunities.value.trim()) || (threats && threats.value.trim());
        case 5:
            return planData.goals && planData.goals.length > 0;
        case 6:
            var targets = document.getElementById('targets-initiatives');
            var kpis = document.getElementById('kpis');
            var strategyMap = document.getElementById('strategy-map');
            return (targets && targets.value.trim()) || (kpis && kpis.value.trim()) || (strategyMap && strategyMap.value.trim());
        case 7:
            var successCriteria = document.getElementById('success-criteria');
            return successCriteria && successCriteria.value.trim();
        default:
            return false;
    }
}

// Update step completion indicators
function updateStepCompletion() {
    for (var i = 1; i <= totalSteps; i++) {
        var indicator = document.getElementById('step' + i + 'Complete');
        if (indicator) {
            if (isStepComplete(i)) {
                indicator.classList.add('show');
            } else {
                indicator.classList.remove('show');
            }
        }
    }
    updateStepDots();
}

// Go to specific step
function goToStep(step) {
    if (step >= 1 && step <= totalSteps) {
        hideStep(currentStep);
        currentStep = step;
        showStep(currentStep);
        updateProgress();
        window.scrollTo(0, 0);
    }
}

// Toggle education section
function toggleEducation(button) {
    var educationBox = button.closest('.education-box');
    if (educationBox) {
        educationBox.classList.toggle('collapsed');
        button.textContent = educationBox.classList.contains('collapsed') ? '+' : '−';
    }
}

// Toggle help text
function toggleHelp(button) {
    var label = button.closest('label');
    if (label) {
        var helpText = label.nextElementSibling;
        if (helpText && helpText.classList.contains('field-help')) {
            helpText.classList.toggle('hidden');
        }
    }
}

// Show proponent popup
function showProponentPopup(proponent) {
    var popup = document.getElementById('proponentPopup');
    var title = document.getElementById('popupTitle');
    var content = document.getElementById('popupContent');
    
    if (!popup || !title || !content) return;
    
    var proponentData = {
        marketing: {
            title: 'Marketing',
            principle: 'DO NOT OVER COMPLICATE. OUTSOURCE IF YOU NEED TO',
            description: 'Get and keep attention. Get brand in front of customers 8 times. Lead generation. Convert to sales team. Marketing includes things like branding, advertising, market research, email/social media outreach.'
        },
        sales: {
            title: 'Sales',
            principle: 'DO NOT COMPETE ON PRICE. COMPETE ON QUALITY!',
            description: 'Qualify customers before interacting. Follow up. Outreach. Build relationships. Do not try to get the sale on first call. The main purpose of Sales is to convert leads into customers. Bring money in.'
        },
        operations: {
            title: 'Operations',
            principle: 'TAKE TIME TO MAKE SURE OPERATIONS IS EFFICIENT',
            description: 'Responsible for delivering product or service to customers. Operations should be ready to react to changes in the market. Don\'t be afraid to outsource parts of operations.'
        },
        administration: {
            title: 'Administration',
            principle: 'If YOU WERE ABSENT COULD THE BUSINESS RUN ITSELF? COULD IT SCALE WITHOUT YOU?',
            description: 'Administration is anything in back end of business that isn\'t Marketing, Sales, or Operations. Examples are Accounting, I.T., H.R., Payroll, etc. Your job is to sit at the top of Administration strategizing and deciding where the business needs to go. You must lay out a strategic plan and communicate it to the team, so they can carry it out. You must create a system that will operate and even grow without you present. Never micromanage, communicate the plan, and trust your team to carry it out.'
        }
    };
    
    var data = proponentData[proponent];
    if (data) {
        title.textContent = data.title;
        content.innerHTML = '<p class="proponent-note"><strong>Principle:</strong> ' + escapeHtml(data.principle) + '</p>' +
                           '<p>' + escapeHtml(data.description) + '</p>';
        popup.classList.add('show');
    }
}

// Close proponent popup
function closeProponentPopup(event) {
    if (event) {
        event.stopPropagation();
    }
    var popup = document.getElementById('proponentPopup');
    if (popup) {
        popup.classList.remove('show');
    }
}

// Add goal
function addGoal() {
    var container = document.getElementById('goalsContainer');
    if (!container) return;
    
    var goalDiv = document.createElement('div');
    goalDiv.className = 'goal-item';
    goalDiv.innerHTML = '<div class="form-group"><label>Goal</label><p class="field-help">Set goals for different time horizons: 6 Month, 1 Year, 10 Year, etc. What do you want to achieve in each timeframe?</p><input type="text" class="goal-title" placeholder="Enter a strategic goal..."></div>' +
        '<div class="form-group"><label>Time Horizon</label><select class="goal-timeline"><option value="">Select timeframe...</option><option value="6-month">6 Months</option><option value="1-year">1 Year</option><option value="3-year">3 Years</option><option value="5-year">5 Years</option><option value="10-year">10 Years</option></select></div>' +
        '<div class="form-group"><label>Strategic Intent</label><p class="field-help">How will you get there? Refer to your SWOT analysis when formulating this.</p><textarea class="goal-strategic-intent" placeholder="Describe how you will achieve this goal..."></textarea></div>' +
        '<div class="form-group"><label>Drivers (Elephant Projects)</label><p class="field-help">What will you focus on? These are your major initiatives or "elephant projects" that drive progress.</p><textarea class="goal-drivers" placeholder="List the key focus areas or major projects..."></textarea></div>' +
        '<div class="form-group"><label>Enablers</label><p class="field-help">What frameworks, resources, and skills will you use? What capabilities do you need to develop?</p><textarea class="goal-enablers" placeholder="List frameworks, resources, and skills needed..."></textarea></div>' +
        '<button class="btn-remove" onclick="removeGoal(this)" style="background: #dc3545; color: white; padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">Remove</button>';
    
    container.appendChild(goalDiv);
    setupEventListeners();
    updateStepCompletion();
}

// Remove goal
function removeGoal(button) {
    var goalItem = button.parentElement;
    goalItem.parentElement.removeChild(goalItem);
    saveGoals();
}

// Save goals
function saveGoals() {
    planData.goals = [];
    var goalItems = document.querySelectorAll('.goal-item');
    for (var i = 0; i < goalItems.length; i++) {
        var title = goalItems[i].querySelector('.goal-title');
        var timeline = goalItems[i].querySelector('.goal-timeline');
        var strategicIntent = goalItems[i].querySelector('.goal-strategic-intent');
        var drivers = goalItems[i].querySelector('.goal-drivers');
        var enablers = goalItems[i].querySelector('.goal-enablers');
        
        if (title && title.value.trim()) {
            planData.goals.push({
                title: title.value,
                timeline: timeline ? timeline.value : '',
                strategicIntent: strategicIntent ? strategicIntent.value : '',
                drivers: drivers ? drivers.value : '',
                enablers: enablers ? enablers.value : ''
            });
        }
    }
}

// Load goals
function loadGoals() {
    var container = document.getElementById('goalsContainer');
    if (!container || !planData.goals || planData.goals.length === 0) return;
    
    container.innerHTML = '';
    for (var i = 0; i < planData.goals.length; i++) {
        var goal = planData.goals[i];
        var goalDiv = document.createElement('div');
        goalDiv.className = 'goal-item';
        goalDiv.innerHTML = '<div class="form-group"><label>Goal</label><p class="field-help">Set goals for different time horizons: 6 Month, 1 Year, 10 Year, etc. What do you want to achieve in each timeframe?</p><input type="text" class="goal-title" value="' + escapeHtml(goal.title) + '" placeholder="Enter a strategic goal..."></div>' +
            '<div class="form-group"><label>Time Horizon</label><select class="goal-timeline"><option value="">Select timeframe...</option><option value="6-month"' + (goal.timeline === '6-month' ? ' selected' : '') + '>6 Months</option><option value="1-year"' + (goal.timeline === '1-year' ? ' selected' : '') + '>1 Year</option><option value="3-year"' + (goal.timeline === '3-year' ? ' selected' : '') + '>3 Years</option><option value="5-year"' + (goal.timeline === '5-year' ? ' selected' : '') + '>5 Years</option><option value="10-year"' + (goal.timeline === '10-year' ? ' selected' : '') + '>10 Years</option></select></div>' +
            '<div class="form-group"><label>Strategic Intent</label><p class="field-help">How will you get there? Refer to your SWOT analysis when formulating this.</p><textarea class="goal-strategic-intent" placeholder="Describe how you will achieve this goal...">' + escapeHtml(goal.strategicIntent || '') + '</textarea></div>' +
            '<div class="form-group"><label>Drivers (Elephant Projects)</label><p class="field-help">What will you focus on? These are your major initiatives or "elephant projects" that drive progress.</p><textarea class="goal-drivers" placeholder="List the key focus areas or major projects...">' + escapeHtml(goal.drivers || '') + '</textarea></div>' +
            '<div class="form-group"><label>Enablers</label><p class="field-help">What frameworks, resources, and skills will you use? What capabilities do you need to develop?</p><textarea class="goal-enablers" placeholder="List frameworks, resources, and skills needed...">' + escapeHtml(goal.enablers || '') + '</textarea></div>' +
            '<button class="btn-remove" onclick="removeGoal(this)" style="background: #dc3545; color: white; padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">Remove</button>';
        container.appendChild(goalDiv);
    }
    setupEventListeners();
    setupCharacterCounts();
    updateStepCompletion();
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Show export options
function showExportOptions() {
    var dropdown = document.getElementById('exportDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Close export dropdown when clicking outside
document.addEventListener('click', function(event) {
    var dropdown = document.getElementById('exportDropdown');
    var exportBtn = event.target.closest('.btn-export');
    if (dropdown && !dropdown.contains(event.target) && !exportBtn) {
        dropdown.classList.remove('show');
    }
});

// Export plan
function exportPlan(format) {
    saveData();
    
    // Close dropdown
    var dropdown = document.getElementById('exportDropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
    }
    
    var filename = 'Strategic_Plan_' + new Date().toISOString().split('T')[0];
    var blob, mimeType, extension;
    
    if (format === 'docx') {
        var content = generateWordDocument();
        // Create HTML that Word can open
        blob = new Blob([content], { type: 'application/msword' });
        mimeType = 'application/msword';
        extension = '.doc';
        filename += extension;
    } else if (format === 'xlsx') {
        var content = generateExcelDocument();
        // Create HTML that Excel can open
        blob = new Blob([content], { type: 'application/vnd.ms-excel' });
        mimeType = 'application/vnd.ms-excel';
        extension = '.xls';
        filename += extension;
    } else {
        var content = generatePlanDocument();
        blob = new Blob([content], { type: 'text/plain' });
        mimeType = 'text/plain';
        extension = '.txt';
        filename += extension;
    }
    
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Generate plan document
function generatePlanDocument() {
    var doc = 'STRATEGIC PLAN\n';
    doc += 'Generated: ' + new Date().toLocaleDateString() + '\n';
    doc += '='.repeat(50) + '\n\n';
    
    doc += 'BUSINESS INFORMATION\n';
    doc += '-'.repeat(50) + '\n';
    doc += 'Business Name: ' + (planData.businessName || 'Not specified') + '\n';
    doc += 'Prepared by: ' + (planData.userName || 'Not specified') + '\n\n';
    
    doc += 'PURPOSE\n';
    doc += '-'.repeat(50) + '\n';
    doc += 'Vision:\n' + planData.vision + '\n\n';
    doc += 'Values:\n' + planData.values + '\n\n';
    doc += 'Mission:\n' + planData.mission + '\n\n';
    
    doc += 'SWOT ANALYSIS\n';
    doc += '-'.repeat(50) + '\n';
    doc += 'Strengths:\n' + planData.strengths + '\n\n';
    doc += 'Weaknesses:\n' + planData.weaknesses + '\n\n';
    doc += 'Opportunities:\n' + planData.opportunities + '\n\n';
    doc += 'Threats:\n' + planData.threats + '\n\n';
    
    doc += 'STRATEGY - GOALS\n';
    doc += '-'.repeat(50) + '\n';
    for (var i = 0; i < planData.goals.length; i++) {
        doc += (i + 1) + '. ' + planData.goals[i].title + '\n';
        doc += '   Time Horizon: ' + planData.goals[i].timeline + '\n';
        doc += '   Strategic Intent: ' + planData.goals[i].strategicIntent + '\n';
        doc += '   Drivers: ' + planData.goals[i].drivers + '\n';
        doc += '   Enablers: ' + planData.goals[i].enablers + '\n\n';
    }
    
    doc += 'EXECUTION\n';
    doc += '-'.repeat(50) + '\n';
    doc += 'Targets & Initiatives:\n' + planData.targetsInitiatives + '\n\n';
    doc += 'Performance Indicators (KPIs):\n' + planData.kpis + '\n\n';
    doc += 'Strategy Map:\n' + planData.strategyMap + '\n\n';
    
    doc += 'MIND MAP - BUSINESS PROPONENTS\n';
    doc += '-'.repeat(50) + '\n';
    doc += 'Marketing:\n' + planData.marketing + '\n\n';
    doc += 'Sales:\n' + planData.sales + '\n\n';
    doc += 'Operations:\n' + planData.operations + '\n\n';
    doc += 'Administration:\n' + planData.administration + '\n\n';
    
    doc += 'REVIEW & MONITORING\n';
    doc += '-'.repeat(50) + '\n';
    doc += 'Review Frequency: ' + planData.reviewFrequency + '\n';
    doc += 'Success Criteria: ' + planData.successCriteria + '\n';
    doc += 'Notes: ' + planData.notes + '\n';
    
    return doc;
}

// Generate Word document (HTML format for Word)
function generateWordDocument() {
    var date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    var businessName = planData.businessName || 'Your Business';
    var userName = planData.userName || 'Strategic Planning Team';
    
    var html = '<!DOCTYPE html>\n';
    html += '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">\n';
    html += '<head>\n';
    html += '<meta charset="utf-8">\n';
    html += '<meta name="ProgId" content="Word.Document">\n';
    html += '<meta name="Generator" content="Microsoft Word">\n';
    html += '<meta name="Originator" content="Microsoft Word">\n';
    html += '<title>Strategic Plan - ' + escapeHtml(businessName) + '</title>\n';
    html += '<!--[if gte mso 9]><xml>\n';
    html += '<w:WordDocument>\n';
    html += '<w:View>Print</w:View>\n';
    html += '<w:Zoom>100</w:Zoom>\n';
    html += '<w:DoNotOptimizeForBrowser/>\n';
    html += '</w:WordDocument>\n';
    html += '</xml><![endif]-->\n';
    html += '<style>\n';
    html += '@page { size: 8.5in 11in; margin: 1in; }\n';
    html += 'body { font-family: "Calibri", "Arial", sans-serif; font-size: 11pt; margin: 0; padding: 0; line-height: 1.5; color: #333; }\n';
    html += '.header { text-align: center; margin-bottom: 30px; padding-bottom: 15px; border-bottom: 3px solid #667eea; page-break-after: avoid; }\n';
    html += '.header h1 { color: #667eea; font-size: 16pt; margin: 10px 0 5px 0; font-weight: bold; }\n';
    html += '.header .business-name { color: #333; font-size: 14pt; font-weight: bold; margin: 5px 0; }\n';
    html += '.header .subtitle { color: #666; font-size: 10pt; margin-top: 5px; }\n';
    html += '.header .meta { color: #999; font-size: 9pt; margin-top: 10px; }\n';
    html += '.section { margin-bottom: 30px; page-break-inside: avoid; }\n';
    html += '.section-title { color: #667eea; font-size: 14pt; font-weight: bold; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 2px solid #667eea; page-break-after: avoid; }\n';
    html += '.subsection { margin-bottom: 15px; margin-left: 0; }\n';
    html += '.subsection-title { color: #555; font-size: 12pt; font-weight: bold; margin-bottom: 6px; margin-top: 12px; }\n';
    html += '.content { margin-bottom: 10px; line-height: 1.5; text-align: left; font-size: 11pt; }\n';
    html += '.content p { margin: 6px 0; }\n';
    html += '.goal-item { background: #f8f9fa; padding: 12px; margin-bottom: 12px; border-left: 4px solid #667eea; page-break-inside: avoid; }\n';
    html += '.goal-title { font-weight: bold; color: #667eea; font-size: 12pt; margin-bottom: 6px; }\n';
    html += '.goal-detail { margin-left: 12px; margin-bottom: 6px; color: #555; font-size: 11pt; line-height: 1.5; }\n';
    html += '.goal-label { font-weight: bold; color: #333; }\n';
    html += '.swot-grid { display: table; width: 100%; margin: 12px 0; border-collapse: separate; border-spacing: 10px; }\n';
    html += '.swot-row { display: table-row; }\n';
    html += '.swot-item { display: table-cell; width: 50%; padding: 12px; vertical-align: top; page-break-inside: avoid; }\n';
    html += '.swot-item h4 { font-weight: bold; margin-bottom: 6px; font-size: 11pt; }\n';
    html += '.swot-item .content { font-size: 10pt; }\n';
    html += '.swot-strengths { background: #e8f5e9; border-left: 3px solid #4caf50; }\n';
    html += '.swot-weaknesses { background: #fff3e0; border-left: 3px solid #ff9800; }\n';
    html += '.swot-opportunities { background: #e3f2fd; border-left: 3px solid #2196f3; }\n';
    html += '.swot-threats { background: #fce4ec; border-left: 3px solid #e91e63; }\n';
    html += '.proponent-item { background: #f8f9fa; padding: 12px; margin-bottom: 12px; border-left: 4px solid #667eea; page-break-inside: avoid; }\n';
    html += '.proponent-title { font-weight: bold; color: #667eea; font-size: 12pt; margin-bottom: 6px; }\n';
    html += 'p { margin: 8px 0; }\n';
    html += 'ul { margin: 8px 0; padding-left: 25px; }\n';
    html += 'li { margin: 4px 0; line-height: 1.5; }\n';
    html += '@media print { .section { page-break-inside: avoid; } }\n';
    html += '</style>\n';
    html += '</head>\n';
    html += '<body>\n';
    
    // Header
    html += '<div class="header">\n';
    html += '<h1>STRATEGIC PLAN</h1>\n';
    html += '<div class="business-name">' + escapeHtml(businessName) + '</div>\n';
    html += '<div class="subtitle">Comprehensive Strategic Planning Document</div>\n';
    html += '<div class="meta">Prepared by: ' + escapeHtml(userName) + ' | Generated: ' + date + '</div>\n';
    html += '</div>\n';
    
    // Purpose Section
    html += '<div class="section">\n';
    html += '<div class="section-title">PURPOSE</div>\n';
    
    if (planData.vision) {
        html += '<div class="subsection">\n';
        html += '<div class="subsection-title">Vision Statement</div>\n';
        html += '<div class="content">' + formatTextForWord(planData.vision) + '</div>\n';
        html += '</div>\n';
    }
    
    if (planData.values) {
        html += '<div class="subsection">\n';
        html += '<div class="subsection-title">Core Values</div>\n';
        html += '<div class="content">' + formatTextForWord(planData.values) + '</div>\n';
        html += '</div>\n';
    }
    
    if (planData.mission) {
        html += '<div class="subsection">\n';
        html += '<div class="subsection-title">Mission Statement</div>\n';
        html += '<div class="content">' + formatTextForWord(planData.mission) + '</div>\n';
        html += '</div>\n';
    }
    
    html += '</div>\n';
    
    // Mind Map Section
    if (planData.marketing || planData.sales || planData.operations || planData.administration) {
        html += '<div class="section">\n';
        html += '<div class="section-title">BUSINESS MIND MAP</div>\n';
        
        if (planData.marketing) {
            html += '<div class="proponent-item">\n';
            html += '<div class="proponent-title">Marketing</div>\n';
            html += '<div class="content">' + formatTextForWord(planData.marketing) + '</div>\n';
            html += '</div>\n';
        }
        
        if (planData.sales) {
            html += '<div class="proponent-item">\n';
            html += '<div class="proponent-title">Sales</div>\n';
            html += '<div class="content">' + formatTextForWord(planData.sales) + '</div>\n';
            html += '</div>\n';
        }
        
        if (planData.operations) {
            html += '<div class="proponent-item">\n';
            html += '<div class="proponent-title">Operations</div>\n';
            html += '<div class="content">' + formatTextForWord(planData.operations) + '</div>\n';
            html += '</div>\n';
        }
        
        if (planData.administration) {
            html += '<div class="proponent-item">\n';
            html += '<div class="proponent-title">Administration</div>\n';
            html += '<div class="content">' + formatTextForWord(planData.administration) + '</div>\n';
            html += '</div>\n';
        }
        
        html += '</div>\n';
    }
    
    // SWOT Analysis
    if (planData.strengths || planData.weaknesses || planData.opportunities || planData.threats) {
        html += '<div class="section">\n';
        html += '<div class="section-title">SWOT ANALYSIS</div>\n';
        html += '<div class="swot-grid">\n';
        html += '<div class="swot-row">\n';
        
        html += '<div class="swot-item swot-strengths">\n';
        html += '<h4>Strengths</h4>\n';
        html += '<div class="content">' + formatTextForWord(planData.strengths || 'Not specified') + '</div>\n';
        html += '</div>\n';
        
        html += '<div class="swot-item swot-weaknesses">\n';
        html += '<h4>Weaknesses</h4>\n';
        html += '<div class="content">' + formatTextForWord(planData.weaknesses || 'Not specified') + '</div>\n';
        html += '</div>\n';
        
        html += '</div>\n';
        html += '<div class="swot-row">\n';
        
        html += '<div class="swot-item swot-opportunities">\n';
        html += '<h4>Opportunities</h4>\n';
        html += '<div class="content">' + formatTextForWord(planData.opportunities || 'Not specified') + '</div>\n';
        html += '</div>\n';
        
        html += '<div class="swot-item swot-threats">\n';
        html += '<h4>Threats</h4>\n';
        html += '<div class="content">' + formatTextForWord(planData.threats || 'Not specified') + '</div>\n';
        html += '</div>\n';
        
        html += '</div>\n';
        html += '</div>\n';
        html += '</div>\n';
    }
    
    // Strategy - Goals
    if (planData.goals && planData.goals.length > 0) {
        html += '<div class="section">\n';
        html += '<div class="section-title">STRATEGY - GOALS</div>\n';
        
        for (var i = 0; i < planData.goals.length; i++) {
            var goal = planData.goals[i];
            html += '<div class="goal-item">\n';
            html += '<div class="goal-title">' + (i + 1) + '. ' + escapeHtml(goal.title) + '</div>\n';
            
            if (goal.timeline) {
                html += '<div class="goal-detail"><span class="goal-label">Time Horizon:</span> ' + escapeHtml(goal.timeline) + '</div>\n';
            }
            
            if (goal.strategicIntent) {
                html += '<div class="goal-detail"><span class="goal-label">Strategic Intent:</span> ' + formatTextForWord(goal.strategicIntent) + '</div>\n';
            }
            
            if (goal.drivers) {
                html += '<div class="goal-detail"><span class="goal-label">Drivers (Elephant Projects):</span> ' + formatTextForWord(goal.drivers) + '</div>\n';
            }
            
            if (goal.enablers) {
                html += '<div class="goal-detail"><span class="goal-label">Enablers:</span> ' + formatTextForWord(goal.enablers) + '</div>\n';
            }
            
            html += '</div>\n';
        }
        
        html += '</div>\n';
    }
    
    // Execution
    if (planData.targetsInitiatives || planData.kpis || planData.strategyMap) {
        html += '<div class="section">\n';
        html += '<div class="section-title">EXECUTION</div>\n';
        
        if (planData.targetsInitiatives) {
            html += '<div class="subsection">\n';
            html += '<div class="subsection-title">Targets & Initiatives</div>\n';
            html += '<div class="content">' + formatTextForWord(planData.targetsInitiatives) + '</div>\n';
            html += '</div>\n';
        }
        
        if (planData.kpis) {
            html += '<div class="subsection">\n';
            html += '<div class="subsection-title">Performance Indicators (KPIs)</div>\n';
            html += '<div class="content">' + formatTextForWord(planData.kpis) + '</div>\n';
            html += '</div>\n';
        }
        
        if (planData.strategyMap) {
            html += '<div class="subsection">\n';
            html += '<div class="subsection-title">Strategy Map</div>\n';
            html += '<div class="content">' + formatTextForWord(planData.strategyMap) + '</div>\n';
            html += '</div>\n';
        }
        
        html += '</div>\n';
    }
    
    // Review & Monitoring
    html += '<div class="section">\n';
    html += '<div class="section-title">REVIEW & MONITORING</div>\n';
    
    html += '<div class="subsection">\n';
    html += '<div class="subsection-title">Review Frequency</div>\n';
    html += '<div class="content">' + escapeHtml(planData.reviewFrequency || 'Not specified') + '</div>\n';
    html += '</div>\n';
    
    if (planData.successCriteria) {
        html += '<div class="subsection">\n';
        html += '<div class="subsection-title">Success Criteria</div>\n';
        html += '<div class="content">' + formatTextForWord(planData.successCriteria) + '</div>\n';
        html += '</div>\n';
    }
    
    if (planData.notes) {
        html += '<div class="subsection">\n';
        html += '<div class="subsection-title">Additional Notes</div>\n';
        html += '<div class="content">' + formatTextForWord(planData.notes) + '</div>\n';
        html += '</div>\n';
    }
    
    html += '</div>\n';
    
    html += '</body>\n';
    html += '</html>\n';
    
    return html;
}

// Format text for Word document (preserve line breaks, escape HTML)
function formatTextForWord(text) {
    if (!text) return '';
    var escaped = escapeHtml(text);
    // Convert line breaks to <br> tags
    escaped = escaped.replace(/\n/g, '<br>');
    // Convert double line breaks to paragraphs
    escaped = escaped.replace(/(<br>\s*){2,}/g, '</p><p>');
    return '<p>' + escaped + '</p>';
}

// Generate Excel document (HTML table format for Excel)
function generateExcelDocument() {
    var date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    var businessName = planData.businessName || 'Your Business';
    var userName = planData.userName || 'Strategic Planning Team';
    
    var html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">\n';
    html += '<head>\n';
    html += '<meta charset="utf-8">\n';
    html += '<!--[if gte mso 9]><xml>\n';
    html += '<x:ExcelWorkbook>\n';
    html += '<x:ExcelWorksheets>\n';
    html += '<x:ExcelWorksheet>\n';
    html += '<x:Name>Strategic Plan</x:Name>\n';
    html += '<x:WorksheetOptions>\n';
    html += '<x:PrintGridlines/>\n';
    html += '<x:FitToPage/>\n';
    html += '<x:FitWidth>1</x:FitWidth>\n';
    html += '<x:FitHeight>1</x:FitHeight>\n';
    html += '</x:WorksheetOptions>\n';
    html += '</x:ExcelWorksheet>\n';
    html += '</x:ExcelWorksheets>\n';
    html += '</x:ExcelWorkbook>\n';
    html += '</xml><![endif]-->\n';
    html += '<style>\n';
    html += 'td { font-family: Calibri, Arial, sans-serif; font-size: 11pt; padding: 8px; vertical-align: top; }\n';
    html += '.header-cell { background-color: #667eea; color: white; font-weight: bold; font-size: 14pt; text-align: center; padding: 15px; }\n';
    html += '.section-header { background-color: #764ba2; color: white; font-weight: bold; font-size: 12pt; padding: 12px; }\n';
    html += '.subsection-header { background-color: #9b7bb8; color: white; font-weight: bold; font-size: 11pt; padding: 10px; }\n';
    html += '.label-cell { background-color: #f0f0f0; font-weight: bold; width: 200px; border-right: 2px solid #ddd; }\n';
    html += '.data-cell { background-color: #ffffff; border-left: 1px solid #e0e0e0; }\n';
    html += '.swot-strengths { background-color: #e8f5e9; border-left: 4px solid #4caf50; }\n';
    html += '.swot-weaknesses { background-color: #fff3e0; border-left: 4px solid #ff9800; }\n';
    html += '.swot-opportunities { background-color: #e3f2fd; border-left: 4px solid #2196f3; }\n';
    html += '.swot-threats { background-color: #fce4ec; border-left: 4px solid #e91e63; }\n';
    html += '.goal-row { background-color: #f8f9fa; border-left: 4px solid #667eea; }\n';
    html += '.proponent-row { background-color: #f8f9fa; border-left: 4px solid #667eea; }\n';
    html += 'table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }\n';
    html += 'td { border: 1px solid #ddd; }\n';
    html += '.meta-row { background-color: #f5f5f5; font-size: 9pt; color: #666; }\n';
    html += '</style>\n';
    html += '</head>\n';
    html += '<body>\n';
    html += '<table>\n';
    
    // Header Row
    html += '<tr>\n';
    html += '<td colspan="2" class="header-cell">STRATEGIC PLAN</td>\n';
    html += '</tr>\n';
    html += '<tr>\n';
    html += '<td colspan="2" style="text-align: center; padding: 10px; background-color: #f8f9fa; font-size: 12pt; font-weight: bold;">' + escapeHtml(businessName) + '</td>\n';
    html += '</tr>\n';
    html += '<tr class="meta-row">\n';
    html += '<td colspan="2" style="text-align: center; padding: 5px;">Prepared by: ' + escapeHtml(userName) + ' | Generated: ' + date + '</td>\n';
    html += '</tr>\n';
    html += '<tr><td colspan="2" style="height: 10px; border: none;"></td></tr>\n';
    
    // Purpose Section
    html += '<tr>\n';
    html += '<td colspan="2" class="section-header">PURPOSE</td>\n';
    html += '</tr>\n';
    
    if (planData.vision) {
        html += '<tr>\n';
        html += '<td class="label-cell">Vision Statement</td>\n';
        html += '<td class="data-cell">' + formatTextForExcel(planData.vision) + '</td>\n';
        html += '</tr>\n';
    }
    
    if (planData.values) {
        html += '<tr>\n';
        html += '<td class="label-cell">Core Values</td>\n';
        html += '<td class="data-cell">' + formatTextForExcel(planData.values) + '</td>\n';
        html += '</tr>\n';
    }
    
    if (planData.mission) {
        html += '<tr>\n';
        html += '<td class="label-cell">Mission Statement</td>\n';
        html += '<td class="data-cell">' + formatTextForExcel(planData.mission) + '</td>\n';
        html += '</tr>\n';
    }
    
    html += '<tr><td colspan="2" style="height: 15px; border: none;"></td></tr>\n';
    
    // Mind Map Section
    if (planData.marketing || planData.sales || planData.operations || planData.administration) {
        html += '<tr>\n';
        html += '<td colspan="2" class="section-header">BUSINESS MIND MAP</td>\n';
        html += '</tr>\n';
        
        if (planData.marketing) {
            html += '<tr class="proponent-row">\n';
            html += '<td class="label-cell" style="font-weight: bold; color: #667eea;">Marketing</td>\n';
            html += '<td class="data-cell">' + formatTextForExcel(planData.marketing) + '</td>\n';
            html += '</tr>\n';
        }
        
        if (planData.sales) {
            html += '<tr class="proponent-row">\n';
            html += '<td class="label-cell" style="font-weight: bold; color: #667eea;">Sales</td>\n';
            html += '<td class="data-cell">' + formatTextForExcel(planData.sales) + '</td>\n';
            html += '</tr>\n';
        }
        
        if (planData.operations) {
            html += '<tr class="proponent-row">\n';
            html += '<td class="label-cell" style="font-weight: bold; color: #667eea;">Operations</td>\n';
            html += '<td class="data-cell">' + formatTextForExcel(planData.operations) + '</td>\n';
            html += '</tr>\n';
        }
        
        if (planData.administration) {
            html += '<tr class="proponent-row">\n';
            html += '<td class="label-cell" style="font-weight: bold; color: #667eea;">Administration</td>\n';
            html += '<td class="data-cell">' + formatTextForExcel(planData.administration) + '</td>\n';
            html += '</tr>\n';
        }
        
        html += '<tr><td colspan="2" style="height: 15px; border: none;"></td></tr>\n';
    }
    
    // SWOT Analysis Section
    if (planData.strengths || planData.weaknesses || planData.opportunities || planData.threats) {
        html += '<tr>\n';
        html += '<td colspan="2" class="section-header">SWOT ANALYSIS</td>\n';
        html += '</tr>\n';
        html += '<tr>\n';
        
        // Strengths and Weaknesses
        html += '<td class="swot-strengths" style="width: 50%;">\n';
        html += '<table style="width: 100%; border: none;">\n';
        html += '<tr><td style="font-weight: bold; font-size: 12pt; padding-bottom: 8px; border: none;">Strengths</td></tr>\n';
        html += '<tr><td style="border: none; padding: 0;">' + formatTextForExcel(planData.strengths || 'Not specified') + '</td></tr>\n';
        html += '</table>\n';
        html += '</td>\n';
        
        html += '<td class="swot-weaknesses" style="width: 50%;">\n';
        html += '<table style="width: 100%; border: none;">\n';
        html += '<tr><td style="font-weight: bold; font-size: 12pt; padding-bottom: 8px; border: none;">Weaknesses</td></tr>\n';
        html += '<tr><td style="border: none; padding: 0;">' + formatTextForExcel(planData.weaknesses || 'Not specified') + '</td></tr>\n';
        html += '</table>\n';
        html += '</td>\n';
        html += '</tr>\n';
        
        html += '<tr>\n';
        // Opportunities and Threats
        html += '<td class="swot-opportunities" style="width: 50%;">\n';
        html += '<table style="width: 100%; border: none;">\n';
        html += '<tr><td style="font-weight: bold; font-size: 12pt; padding-bottom: 8px; border: none;">Opportunities</td></tr>\n';
        html += '<tr><td style="border: none; padding: 0;">' + formatTextForExcel(planData.opportunities || 'Not specified') + '</td></tr>\n';
        html += '</table>\n';
        html += '</td>\n';
        
        html += '<td class="swot-threats" style="width: 50%;">\n';
        html += '<table style="width: 100%; border: none;">\n';
        html += '<tr><td style="font-weight: bold; font-size: 12pt; padding-bottom: 8px; border: none;">Threats</td></tr>\n';
        html += '<tr><td style="border: none; padding: 0;">' + formatTextForExcel(planData.threats || 'Not specified') + '</td></tr>\n';
        html += '</table>\n';
        html += '</td>\n';
        html += '</tr>\n';
        
        html += '<tr><td colspan="2" style="height: 15px; border: none;"></td></tr>\n';
    }
    
    // Strategy - Goals Section
    if (planData.goals && planData.goals.length > 0) {
        html += '<tr>\n';
        html += '<td colspan="2" class="section-header">STRATEGY - GOALS</td>\n';
        html += '</tr>\n';
        
        for (var i = 0; i < planData.goals.length; i++) {
            var goal = planData.goals[i];
            html += '<tr class="goal-row">\n';
            html += '<td colspan="2" style="font-weight: bold; color: #667eea; font-size: 12pt; padding: 10px;">Goal ' + (i + 1) + ': ' + escapeHtml(goal.title) + '</td>\n';
            html += '</tr>\n';
            
            if (goal.timeline) {
                html += '<tr class="goal-row">\n';
                html += '<td class="label-cell">Time Horizon</td>\n';
                html += '<td class="data-cell">' + escapeHtml(goal.timeline) + '</td>\n';
                html += '</tr>\n';
            }
            
            if (goal.strategicIntent) {
                html += '<tr class="goal-row">\n';
                html += '<td class="label-cell">Strategic Intent</td>\n';
                html += '<td class="data-cell">' + formatTextForExcel(goal.strategicIntent) + '</td>\n';
                html += '</tr>\n';
            }
            
            if (goal.drivers) {
                html += '<tr class="goal-row">\n';
                html += '<td class="label-cell">Drivers (Elephant Projects)</td>\n';
                html += '<td class="data-cell">' + formatTextForExcel(goal.drivers) + '</td>\n';
                html += '</tr>\n';
            }
            
            if (goal.enablers) {
                html += '<tr class="goal-row">\n';
                html += '<td class="label-cell">Enablers</td>\n';
                html += '<td class="data-cell">' + formatTextForExcel(goal.enablers) + '</td>\n';
                html += '</tr>\n';
            }
            
            html += '<tr><td colspan="2" style="height: 10px; border: none;"></td></tr>\n';
        }
        
        html += '<tr><td colspan="2" style="height: 15px; border: none;"></td></tr>\n';
    }
    
    // Execution Section
    if (planData.targetsInitiatives || planData.kpis || planData.strategyMap) {
        html += '<tr>\n';
        html += '<td colspan="2" class="section-header">EXECUTION</td>\n';
        html += '</tr>\n';
        
        if (planData.targetsInitiatives) {
            html += '<tr>\n';
            html += '<td class="label-cell">Targets & Initiatives</td>\n';
            html += '<td class="data-cell">' + formatTextForExcel(planData.targetsInitiatives) + '</td>\n';
            html += '</tr>\n';
        }
        
        if (planData.kpis) {
            html += '<tr>\n';
            html += '<td class="label-cell">Performance Indicators (KPIs)</td>\n';
            html += '<td class="data-cell">' + formatTextForExcel(planData.kpis) + '</td>\n';
            html += '</tr>\n';
        }
        
        if (planData.strategyMap) {
            html += '<tr>\n';
            html += '<td class="label-cell">Strategy Map</td>\n';
            html += '<td class="data-cell">' + formatTextForExcel(planData.strategyMap) + '</td>\n';
            html += '</tr>\n';
        }
        
        html += '<tr><td colspan="2" style="height: 15px; border: none;"></td></tr>\n';
    }
    
    // Review & Monitoring Section
    html += '<tr>\n';
    html += '<td colspan="2" class="section-header">REVIEW & MONITORING</td>\n';
    html += '</tr>\n';
    
    html += '<tr>\n';
    html += '<td class="label-cell">Review Frequency</td>\n';
    html += '<td class="data-cell">' + escapeHtml(planData.reviewFrequency || 'Not specified') + '</td>\n';
    html += '</tr>\n';
    
    if (planData.successCriteria) {
        html += '<tr>\n';
        html += '<td class="label-cell">Success Criteria</td>\n';
        html += '<td class="data-cell">' + formatTextForExcel(planData.successCriteria) + '</td>\n';
        html += '</tr>\n';
    }
    
    if (planData.notes) {
        html += '<tr>\n';
        html += '<td class="label-cell">Additional Notes</td>\n';
        html += '<td class="data-cell">' + formatTextForExcel(planData.notes) + '</td>\n';
        html += '</tr>\n';
    }
    
    html += '</table>\n';
    html += '</body>\n';
    html += '</html>\n';
    
    return html;
}

// Format text for Excel (preserve line breaks)
function formatTextForExcel(text) {
    if (!text) return '';
    var escaped = escapeHtml(text);
    // Convert line breaks to Excel line breaks (Alt+Enter)
    escaped = escaped.replace(/\n/g, '&#10;');
    return escaped;
}

// Load sample data for testing/demonstration
function loadSampleData() {
    // Save current user data before loading sample data
    saveData(); // Ensure current data is saved
    userDataBackup = JSON.parse(JSON.stringify(planData)); // Deep copy current data
    
    // Step 1: Purpose
    planData.businessName = 'TechFlow Solutions';
    planData.userName = 'Sarah Chen, CEO';
    planData.vision = 'To become the leading provider of digital transformation consulting services in the Pacific Northwest, recognized for innovative solutions that help mid-market companies scale efficiently and compete in the digital economy. By 2030, we aim to serve 500+ clients and achieve $50M in annual revenue.';
    planData.values = 'Innovation\nIntegrity\nClient Success\nContinuous Learning\nWork-Life Balance\nDiversity & Inclusion';
    planData.mission = 'TechFlow Solutions exists to empower mid-market businesses with cutting-edge technology solutions and strategic guidance. We bridge the gap between complex technology and business outcomes, helping our clients achieve sustainable growth through digital transformation, cloud migration, and data-driven decision making.';
    
    // Step 3: Mind Map (Business Proponents)
    planData.marketing = 'Target Market: Mid-market companies (50-500 employees) in manufacturing, healthcare, and professional services.\n\nChannels: LinkedIn advertising, industry conferences, content marketing (blog, whitepapers), referral partnerships with accounting firms and business consultants.\n\nStrategy: Thought leadership positioning, case studies, webinars, and free technology assessments.\n\nResponsible: Jennifer Martinez, Marketing Director\n\nGoal: Generate 50 qualified leads per month, maintain 8+ touchpoints with prospects before sales handoff.';
    planData.sales = 'Process: Inbound lead qualification → Discovery call → Technical assessment → Proposal → Negotiation → Close\n\nApproach: Consultative selling focused on ROI and business outcomes, not just technology features. Average sales cycle: 60-90 days.\n\nResponsible: Michael Thompson, VP of Sales\n\nTeam: 3 account executives, 1 sales engineer\n\nTarget: $2M ARR by end of year, 30% close rate on qualified opportunities.';
    planData.operations = 'Service Delivery: Agile project management, 2-week sprints, dedicated project managers for each engagement\n\nCore Services: Cloud migration (AWS/Azure), custom software development, data analytics implementation, cybersecurity assessments\n\nQuality Assurance: Code reviews, automated testing, client feedback loops, quarterly service reviews\n\nResponsible: David Kim, Director of Operations\n\nTeam: 12 developers, 4 project managers, 2 DevOps engineers\n\nOutsourcing: UI/UX design, specialized security audits, content writing.';
    planData.administration = 'Finance: QuickBooks Online, monthly P&L reviews, quarterly board meetings, annual budget planning\n\nHR: BambooHR for payroll and benefits, 401(k) matching, professional development budget ($2K per employee annually)\n\nIT Infrastructure: Microsoft 365, Slack, Jira, GitHub Enterprise, AWS for hosting\n\nLegal: Outside counsel for contracts, annual compliance review\n\nResponsible: Operations team with CEO oversight\n\nSystems: All processes documented in Notion, can operate 2+ weeks without CEO presence, scalable to 50 employees without major restructuring.';
    
    // Step 4: SWOT Analysis
    planData.strengths = '• Deep technical expertise in cloud architecture and modern development practices\n• Strong client relationships with 95% retention rate\n• Agile, adaptable team culture that responds quickly to market changes\n• Proven track record: 50+ successful implementations in past 3 years\n• Strong brand reputation in local market\n• Diverse skill set across team (full-stack, DevOps, data, security)';
    planData.weaknesses = '• Limited brand recognition outside Pacific Northwest\n• Heavy reliance on key personnel (3 senior engineers handle 60% of complex projects)\n• Limited marketing budget compared to larger competitors\n• No dedicated sales team until recently (CEO was primary salesperson)\n• Limited experience with enterprise clients (500+ employees)\n• Cash flow challenges during slow months (seasonal business)';
    planData.opportunities = '• Growing demand for digital transformation post-COVID\n• Partnership opportunities with Microsoft and AWS (can become certified partner)\n• Emerging AI/ML market - clients asking about implementation\n• Remote work trend allows us to serve clients nationwide\n• Government contracts (small business set-asides)\n• Acquisition of smaller consulting firms in adjacent markets\n• Industry-specific solutions (healthcare compliance, manufacturing automation)';
    planData.threats = '• Large consulting firms (Deloitte, Accenture) entering mid-market space with lower prices\n• Economic downturn could reduce client IT budgets\n• Talent shortage in tech industry - difficult to hire senior engineers\n• Rapid technology changes require constant training investment\n• Client concentration risk (top 3 clients = 40% of revenue)\n• Cybersecurity threats to our own infrastructure and client systems';
    
    // Step 5: Strategy - Goals
    planData.goals = [
        {
            title: 'Achieve $5M Annual Recurring Revenue',
            timeline: '3-year',
            strategicIntent: 'Leverage our strengths in cloud migration and client relationships while addressing weaknesses in sales capacity and geographic reach. Focus on expanding service offerings (AI/ML, cybersecurity) and building strategic partnerships to access new markets.',
            drivers: '1. Hire 2 additional senior sales executives\n2. Launch AI/ML consulting practice\n3. Establish AWS and Microsoft partner status\n4. Develop 3 industry-specific solution packages\n5. Expand marketing budget by 150%',
            enablers: '• Salesforce CRM implementation\n• Marketing automation platform (HubSpot)\n• Enhanced project management tools\n• Employee training program for AI/ML\n• Strategic partnership framework\n• $2M working capital line of credit'
        },
        {
            title: 'Build Scalable Operations Infrastructure',
            timeline: '1-year',
            strategicIntent: 'Address operational weaknesses by creating systems and processes that reduce dependency on key personnel. Implement standardized methodologies, knowledge management systems, and cross-training programs.',
            drivers: '1. Document all service delivery processes\n2. Implement knowledge base and internal wiki\n3. Cross-train team members on critical skills\n4. Establish quality assurance checkpoints\n5. Create client onboarding playbook',
            enablers: '• Notion for documentation\n• Standardized project templates\n• Weekly team training sessions\n• Quality metrics dashboard\n• Client feedback system'
        },
        {
            title: 'Expand Geographic Reach',
            timeline: '2-year',
            strategicIntent: 'Capitalize on remote work trend and partnership opportunities to serve clients beyond Pacific Northwest. Use virtual delivery model and strategic partnerships to enter new markets without physical presence.',
            drivers: '1. Develop remote delivery capabilities\n2. Partner with regional business consultants\n3. Create virtual workshop and assessment offerings\n4. Target 3 new geographic markets\n5. Build case studies from remote engagements',
            enablers: '• Video conferencing infrastructure\n• Remote collaboration tools\n• Partnership agreement templates\n• Marketing materials for new markets\n• Virtual delivery methodology'
        }
    ];
    
    // Step 6: Execution
    planData.targetsInitiatives = 'Q1 Targets:\n• Hire 1 senior sales executive\n• Complete AWS partner application\n• Launch 2 new service offerings (AI assessment, security audit)\n• Achieve $400K quarterly revenue\n• Onboard 8 new clients\n\nQ2 Targets:\n• Hire second sales executive\n• Complete Microsoft partner application\n• Develop healthcare industry solution package\n• Achieve $500K quarterly revenue\n• Implement Salesforce CRM\n\nQ3-Q4 Targets:\n• Launch AI/ML consulting practice\n• Establish 2 strategic partnerships\n• Enter 1 new geographic market\n• Achieve $600K+ quarterly revenue\n• Reduce client concentration risk (top 3 clients < 30% of revenue)';
    planData.kpis = 'Revenue Metrics:\n• Monthly Recurring Revenue (MRR)\n• Annual Recurring Revenue (ARR)\n• Revenue per client\n• Revenue growth rate (target: 40% YoY)\n\nSales Metrics:\n• Lead conversion rate (target: 30%)\n• Average sales cycle length (target: 60 days)\n• Sales pipeline value\n• New client acquisition rate (target: 8-10 per quarter)\n\nOperational Metrics:\n• Project delivery on-time rate (target: 90%)\n• Client satisfaction score (target: 4.5/5)\n• Employee utilization rate (target: 75%)\n• Billable hours per employee\n\nFinancial Metrics:\n• Gross margin (target: 65%)\n• Operating margin (target: 20%)\n• Cash runway (target: 6+ months)\n• Days sales outstanding (target: < 45 days)';
    planData.strategyMap = 'Communication Strategy:\n• Monthly all-hands meeting to review progress on strategic goals\n• Quarterly board meetings with key stakeholders\n• Weekly leadership team check-ins\n• Client quarterly business reviews\n• Annual strategic planning retreat\n\nTesting & Validation:\n• Monthly KPI dashboard review\n• Quarterly strategy review and adjustment\n• Annual comprehensive strategic plan update\n• Client feedback surveys (quarterly)\n• Employee engagement surveys (biannually)\n• Competitive analysis (quarterly)\n\nSuccess Metrics:\n• Track progress against KPIs monthly\n• Review goal achievement quarterly\n• Adjust tactics based on market feedback\n• Celebrate wins and learn from failures';
    
    // Step 7: Review & Monitoring
    planData.reviewFrequency = 'quarterly';
    planData.successCriteria = 'Year 1 Success Criteria:\n• Achieve $2M ARR\n• Maintain 95%+ client retention\n• Hire 5 new team members\n• Launch 2 new service offerings\n• Establish 1 strategic partnership\n• Achieve 4.5+ client satisfaction score\n\nYear 2-3 Success Criteria:\n• Achieve $5M ARR\n• Serve 100+ active clients\n• Expand to 2 new geographic markets\n• Build team to 30+ employees\n• Achieve 20%+ operating margin\n• Establish thought leadership in 2 industry verticals';
    planData.notes = 'Key Considerations:\n• Monitor economic indicators closely - be prepared to pivot if recession impacts client budgets\n• Invest in employee retention - competitive salaries and strong culture are critical in tight labor market\n• Maintain focus on quality over quantity - better to have fewer high-value clients than many low-margin ones\n• Build cash reserves during strong quarters to weather slow periods\n• Stay current on technology trends - allocate 10% of time to learning and experimentation\n• Consider acquisition opportunities if they accelerate strategic goals\n\nRisk Mitigation:\n• Diversify client base to reduce concentration risk\n• Build bench strength to reduce key person dependency\n• Maintain strong banking relationships for working capital access\n• Invest in cybersecurity to protect client data and our reputation';
    
    // Populate the form
    populateForm();
    
    // Update UI
    updateStepCompletion();
    updateProgress();
    setupCharacterCounts();
    
    // Show "Your data" button and hide "Load Sample Data" button
    var sampleDataBtn = document.querySelector('button[onclick="loadSampleData()"]');
    var yourDataBtnContainer = document.getElementById('yourDataButtonContainer');
    
    if (sampleDataBtn) {
        sampleDataBtn.style.display = 'none';
    }
    
    if (!yourDataBtnContainer) {
        // Create the "Your data" button container if it doesn't exist
        var buttonDiv = document.querySelector('div[style*="text-align: center"]');
        if (buttonDiv) {
            var yourDataDiv = document.createElement('div');
            yourDataDiv.id = 'yourDataButtonContainer';
            yourDataDiv.style.cssText = 'text-align: center; margin-top: 15px;';
            yourDataDiv.innerHTML = '<button onclick="restoreUserData()" style="background: #28a745; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 0.9em; transition: all 0.3s ease;">Your Data</button>';
            buttonDiv.appendChild(yourDataDiv);
        }
    } else {
        yourDataBtnContainer.style.display = 'block';
    }
    
    // Show confirmation
    alert('Sample data loaded! This demonstrates a complete strategic plan for TechFlow Solutions, a tech consulting business.');
}

// Restore user's original data
function restoreUserData() {
    if (!userDataBackup) {
        alert('No user data to restore.');
        return;
    }
    
    // Restore the user's data
    planData = JSON.parse(JSON.stringify(userDataBackup)); // Deep copy backup
    userDataBackup = null; // Clear backup
    
    // Populate the form with user's data
    populateForm();
    
    // Update UI
    updateStepCompletion();
    updateProgress();
    setupCharacterCounts();
    
    // Hide "Your data" button and show "Load Sample Data" button
    var sampleDataBtn = document.querySelector('button[onclick="loadSampleData()"]');
    var yourDataBtnContainer = document.getElementById('yourDataButtonContainer');
    
    if (sampleDataBtn) {
        sampleDataBtn.style.display = 'inline-block';
    }
    
    if (yourDataBtnContainer) {
        yourDataBtnContainer.style.display = 'none';
    }
    
    // Save restored data
    saveData();
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
